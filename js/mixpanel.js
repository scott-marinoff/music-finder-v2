// This function executes when a user loads the sign up page
function signupPageViewed() {

	// Set a 'Signup Page Views' count Super Property
	var pagesViewed = mixpanel.get_property('Signup Page Views (Session)')

	if (pagesViewed !== 'undefined') {
		mixpanel.register_once({
			"Signup Page Views (Session)": 1
		});
	} else {
		mixpanel.register({
			"Signup Page Views (Session)": pagesViewed + 1
		});
	}

	mixpanel.track("Viewed Signup Page");
}

// This function executes after a user successfully signs up
// The "user" object contains the following properties: name, email, favorite_genre, plan, id
// e.g. calling user.id will return the user's id
function accountCreated(user) {

	mixpanel.identify(user.id);

	const currentDate = new Date();
	const timestamp = currentDate.toISOString();

	mixpanel.people.set({

		"$name" : user.name,
		"$email" : user.email,
		"$created" : timestamp,
		"Plan" : user.plan,
		"Preferred Genre" : user.favorite_genre
	});

	mixpanel.people.union({
		"Genres Played" : user.favorite_genre
	});

	mixpanel.register({
		"User ID" : user.id,
		"Plan" : user.plan,
		"Preferred Genre" : user.favorite_genre
	});

	mixpanel.track("Created Account");
}

// This function executes when a user successfully logs in
// The "user" object contains the following properties: name, email, favorite_genre, plan, id
// e.g. calling user.id will return the user's id
function login(user) {

	mixpanel.identify(user.id);

	mixpanel.register({
		"User ID" : user.id,
		"Plan" : user.plan,
		"Preferred Genre" : user.favorite_genre
	});

	mixpanel.track("Logged In");
}

// This function executes when a user successfully logs out
// It clears super properties from the Mixpanel cookie
function logout() {

	mixpanel.track("Logged Out");
	mixpanel.reset();
}

// This function executes every time a song is played
// The "song" object contains the following properties: title, artist, genre, duration
// e.g. calling song.title will return the song's title
function songPlayed(song) {

	// Set a 'Songs Played' count Super Property
	let playedProperty = "Songs Played (Session)";
	let songsPlayed = mixpanel.get_property(playedProperty);

	// Add Songs Played
	if (songsPlayed === 'undefined') {
		mixpanel.register_once({
			playedProperty : 1
		});
	} else {
		mixpanel.register({
			playedProperty : songsPlayed + 1
		});
	};

	// Add Artists played to profile
	mixpanel.people.union({
		"Artists Played" : song.artist,
		"Genres Played" : song.genre
	});

	// Track songs played to profile
	mixpanel.people.set_once({
		"Songs Played" : 0
	});

	mixpanel.people.increment("Songs Played", 1);

	// Track song played event
	mixpanel.track("Played Song",{
		"Title" : song.title,
		"Artist" : song.artist,
		"Genre" : song.genre,
		"Duration" : song.duration
	});
}

// This function executes every time a song is purchased
// The "song" object contains the following properties: title, artist, genre, duration, price
// e.g. calling song.title will return the song's title
function songPurchased(song) {

	// Set a 'Songs Purchased' count Super Property
	// ** FIX ** For some reason, this doesn't seem to be working...
	let purchasedProperty = "Songs Purchased (Session)";
	console.log(purchasedProperty);
	let songsPurchased = mixpanel.get_property(purchasedProperty);
	console.log(songsPurchased);

	// Add Songs Purchased and Total Spent as Super Properties
	if (mixpanel.get_property("Songs Purchased (Session)") === 'undefined') {
		mixpanel.register_once({
			"Songs Purchased (Session)" : 1,
			"Total Spent (Session)" : song.price
		});
	} else {
		mixpanel.register({
			"Songs Purchased (Session)" : mixpanel.get_property("Songs Purchased (Session)") + 1,
			"Total Spent (Session)" : mixpanel.get_property('Total Spent (Session)') + song.price
		});
	};

	// Add songs purchased to profile
	mixpanel.people.union({
		"Artists Purchased" : song.artist,
		"Genres Purchased" : song.genre
	});

	// Add count and cost of songs purchased to profile
	mixpanel.people.set_once({
		"Songs Purchased" : 0,
		"Total Spent" : 0
	});

	mixpanel.people.increment({
		"Songs Purchased" : 1, 
		"Total Spent" : song.price
	});

	// Track song purchase event
	mixpanel.track("Purchased Song",{
		"Title" : song.title,
		"Artist" : song.artist,
		"Genre" : song.genre,
		"Price" : song.price
	});
}

// This function executes when a user upgrades from a Free plan to a Premium plan
function planUpgraded() {
	
	// Get current date/time in ISO format
	const currentDate = new Date();
	const timestamp = currentDate.toISOString();

	// Grab properties from MP cookie
	let currentPlan = mixpanel.get_property('Plan');
	let lastChange = mixpanel.get_property('Last Upgraded');

	// Track upgrade with previous plan and date last changed
	// Will allow you to calc time between upgrade/downgrade
	mixpanel.track("Upgraded Plan",{
		"Upgraded From" : currentPlan,
		"Last Upgraded" : lastChange
	});

	// Update user profile with new plan info
	mixpanel.people.set({
		"Plan" : "Premium",
		"Last Upgraded" : timestamp
	});

	// Track number of upgrades
	mixpanel.people.set_once({
		"Times Upgraded" : 0
	});

	mixpanel.people.increment({
		"Times Upgraded" : 1
	});

	// Update cookie with new plan info
	mixpanel.register({
		"Plan" : "Premium",
		"Last Upgraded" : timestamp
	});
}

// This function executes when a user downgrades from a Premium plan to a Free plan
function planDowngraded() {
	
	// Get current date/time in ISO format
	const currentDate = new Date();
	const timestamp = currentDate.toISOString();

	// Grab properties from MP cookie
	let currentPlan = mixpanel.get_property('Plan');
	let lastChange = mixpanel.get_property('Last Upgraded');

	// Track downgrade with previous plan and date last changed
	// Will allow you to calc time between upgrade/downgrade
	mixpanel.track("Downgraded Plan",{
		"Downgraded From" : currentPlan,
		"Last Upgraded" : lastChange
	});

	// Update user profile with new plan info
	mixpanel.people.set({
		"Plan" : "Free",
		"Last Downgraded" : timestamp
	});

	// Track number of downgrades
	mixpanel.people.set_once({
		"Times Downgraded" : 0
	});

	mixpanel.people.increment({
		"Times Downgraded" : 1
	});

	// Update cookie with new plan info
	mixpanel.register({
		"Plan" : "Free",
		"Last Downgraded" : timestamp
	});
}
