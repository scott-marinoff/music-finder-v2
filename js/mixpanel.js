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
	const timestamp = currentDate.getTime();

	mixpanel.people.set({
		"$name" : user.name,
		"$email" : user.email,
		"$created" : timestamp,
		"Plan" : user.plan,
		"Preferred Genre" : user.favorite_genre
	});

	mixpanel.people.union({
		"Genres" : user.favorite_genre
	});

	mixpanel.register({
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
	var songsPlayed = mixpanel.get_property('Songs Played (Session)');

	if (songsPlayed === 'undefined') {
		mixpanel.register_once({
			"Songs Played (Session)": 1
		});
	} else {
		mixpanel.register({
			"Songs Played (Session)": songsPlayed + 1
		});
	};

	mixpanel.people.set_once({
		"Songs Played" : 0
	});

	mixpanel.people.increment("Songs Played", 1)

	mixpanel.track("Played Song",{
		"Title" : song.title,
		"Artist" : song.artist,
		"Genre" : song.genre,
		"Duration" : song.duration
	});

	mixpanel.people.union({
		"Genres" : song.genre
	});
}

// This function executes every time a song is purchased
// The "song" object contains the following properties: title, artist, genre, duration, price
// e.g. calling song.title will return the song's title
function songPurchased(song) {

	// Set a 'Songs Played' count Super Property
	var purchasedProperty = "Songs Purchased (Session)";
	var songsPurchased = mixpanel.get_property('Songs Purchased (Session)');

	if (songsPurchased === 'undefined') {
		mixpanel.register_once({
			purchasedProperty : 1,
			"Total Spent (Session)" : song.price
		});
	} else {
		mixpanel.register({
			purchasedProperty : songsPurchased + 1,
			"Total Spent (Session)" : mixpanel.get_property('Total Spent (Session)') + song.price
		});
	};

	mixpanel.people.set_once({
		"Songs Purchased" : 0,
		"Total Spent" : 0
	});

	mixpanel.people.increment({
		"Songs Purchased" : 1, 
		"Total Spent" : song.price
	});

	mixpanel.track("Purchased Song",{
		"Title" : song.title,
		"Artist" : song.artist,
		"Genre" : song.genre,
		"Price" : song.price
	});
}

// This function executes when a user upgrades from a Free plan to a Premium plan
function planUpgraded() {
	
	const currentDate = new Date();
	const timestamp = currentDate.getTime();

	mixpanel.track("Upgraded Plan",{
		"Previous Plan" : mixpanel.get_property('Plan')
	});

	mixpanel.people.set({
		"Plan" : "Premium",
		"Last Upgraded" : timestamp
	});

	mixpanel.people.set_once({
		"Times Upgraded" : 0
	});

	mixpanel.people.increment({
		"Times Upgraded" : 1
	});

	mixpanel.register({
		"Plan" : "Premium",
		"Last Upgraded" : timestamp
	});
}

// This function executes when a user downgrades from a Premium plan to a Free plan
function planDowngraded() {
	
	const currentDate = new Date();
	const timestamp = currentDate.getTime();

	mixpanel.track("Downgraded Plan",{
		"Previous Plan" : mixpanel.get_property('Plan')
	});

	mixpanel.people.set({
		"Plan" : "Free",
		"Last Downgraded" : timestamp
	});

	mixpanel.people.set_once({
		"Times Downgraded" : 0
	});

	mixpanel.people.increment({
		"Times Downgraded" : 1
	});

	mixpanel.register({
		"Plan" : "Free",
		"Last Downgraded" : timestamp
	});
}
