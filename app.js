// UNO Web Game Frontend Logic

document.addEventListener('DOMContentLoaded', function () {
    // Screen elements
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');
    const modeScreen = document.getElementById('mode-screen');
    const multiplayerOptions = document.getElementById('multiplayer-options');
    const createRoomFormSection = document.getElementById('create-room-form');
    const joinRoomFormSection = document.getElementById('join-room-form');
    // Login
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    // Register
    const showRegister = document.getElementById('show-register');
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    const backToLogin = document.getElementById('back-to-login');
    // Navigation
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const backToMode = document.getElementById('back-to-mode');
    const backToMultiplayer = document.getElementById('back-to-multiplayer');
    const backToMultiplayer2 = document.getElementById('back-to-multiplayer2');
    const logoutBtn = document.getElementById('logout-btn');
    // Room forms
    const roomCreateForm = document.getElementById('room-create-form');
    const roomCodeSection = document.getElementById('room-code-section');
    const roomCodeBox = document.getElementById('room-code');
    const roomJoinForm = document.getElementById('room-join-form');
    // How to Play
    const howToPlayBtn = document.getElementById('howtoplay-btn');
    const howToPlayScreen = document.getElementById('howtoplay-screen');
    const backToHome = document.getElementById('back-to-home');
    const okToHome = document.getElementById('ok-to-home');
    // Profile
    const profileBtn = document.getElementById('profile-btn');
    const profileScreen = document.getElementById('profile-screen');
    const backToHomeProfile = document.getElementById('back-to-home-profile');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileAvatarLarge = document.getElementById('profile-avatar-large');
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const profilePlayed = document.getElementById('profile-played');
    const profileWon = document.getElementById('profile-won');
    const profileLost = document.getElementById('profile-lost');
    const profileStreak = document.getElementById('profile-streak');
    const changeAvatarForm = document.getElementById('change-avatar-form');
    const profilePlayerName = document.getElementById('profile-player-name');
    // LOBBY LOGIC
    const lobbyScreen = document.getElementById('lobby-screen');
    const lobbyRoomCode = document.getElementById('lobby-room-code');
    const lobbyAdminAvatar = document.getElementById('lobby-admin-avatar');
    const lobbyAdminName = document.getElementById('lobby-admin-name');
    const lobbyEntryAmount = document.getElementById('lobby-entry-amount');
    const lobbyStartBtn = document.getElementById('lobby-start-btn');
    const copyRoomCodeBtn = document.getElementById('copy-room-code');
    const shareRoomUrlBtn = document.getElementById('share-room-url');
    const lobbySlots = [
        document.getElementById('lobby-slot-2'),
        document.getElementById('lobby-slot-3'),
        document.getElementById('lobby-slot-4')
    ];

    // Helper to show/hide screens
    function showScreen(screen) {
        [loginScreen, registerScreen, modeScreen, multiplayerOptions, createRoomFormSection, joinRoomFormSection, howToPlayScreen, profileScreen, lobbyScreen].forEach(sec => {
            sec.classList.add('hidden-screen');
            sec.classList.remove('active-screen');
        });
        screen.classList.remove('hidden-screen');
        screen.classList.add('active-screen');
    }

    // Dummy login credentials
    // Update all avatar image paths to use avatar/ folder
    // Update all references to 'a1.jpg'...'a6.jpg' to 'avatar/a1.jpg'...'avatar/a6.jpg'
    // Update waiting slot image to 'add.png' (in root or avatar folder as needed)

    // Update dummy user
    let users = [{ username: 'Devdeep', password: '12345', name: 'Devdeep', avatar: 'avatar/a5.jpg', played: 0, won: 0, lost: 0, streak: 0 }];
    let currentUser = null;
    let currentRoom = null;
    let isAdmin = false;

    // Login form submit
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            loginError.textContent = '';
            currentUser = user;
            updateProfileButton();
            showScreen(modeScreen);
            loginForm.reset();
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    // Show register form
    showRegister.addEventListener('click', function (e) {
        e.preventDefault();
        showScreen(registerScreen);
        registerForm.reset();
        registerError.textContent = '';
    });

    // Register 'Sign in' link to go back to login
    // This must be inside the main DOMContentLoaded handler to ensure all elements are available
    const signInLink = document.getElementById('sign-in-link');
    if (signInLink) {
        signInLink.addEventListener('click', function (e) {
            e.preventDefault();
            showScreen(loginScreen);
            registerForm.reset();
            registerError.textContent = '';
        });
    }

    // Register form submit
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const avatar = registerForm.querySelector('input[name="reg-avatar"]:checked');
        if (!name || !username || !password || !confirm || !avatar) {
            registerError.textContent = 'All fields are required.';
            return;
        }
        if (password !== confirm) {
            registerError.textContent = 'Passwords do not match.';
            return;
        }
        if (users.some(u => u.username === username)) {
            registerError.textContent = 'Username already exists.';
            return;
        }
        const newUser = { username, password, name, avatar: avatar.value, played: 0, won: 0, lost: 0, streak: 0 };
        users.push(newUser);
        registerError.textContent = '';
        currentUser = newUser;
        updateProfileButton();
        showScreen(modeScreen);
        registerForm.reset();
        // Optionally, show a welcome message or toast here
        // alert('Registration successful! You are now logged in.');
    });

    // Back to login from register
    if (backToLogin) {
        backToLogin.addEventListener('click', function () {
            showScreen(loginScreen);
        });
    }

    // Update profile button
    function updateProfileButton() {
        if (currentUser) {
            profileAvatar.src = currentUser.avatar;
            profilePlayerName.textContent = currentUser.name;
        }
    }

    // Profile screen update
    function updateProfileScreen() {
        if (currentUser) {
            profileAvatarLarge.src = currentUser.avatar;
            profileName.textContent = currentUser.name;
            profileUsername.textContent = currentUser.username;
            profilePlayed.textContent = currentUser.played;
            profileWon.textContent = currentUser.won;
            profileLost.textContent = currentUser.lost;
            profileStreak.textContent = currentUser.streak;
            // Set avatar radio
            const radios = changeAvatarForm.querySelectorAll('input[name="profile-avatar"]');
            radios.forEach(r => { r.checked = (r.value === currentUser.avatar); });
            // Set player name below avatar
            const profileAvatarPlayerName = document.getElementById('profile-avatar-player-name');
            if (profileAvatarPlayerName) {
                profileAvatarPlayerName.textContent = currentUser.name;
            }
        }
    }

    // Profile navigation
    profileBtn.addEventListener('click', function () {
        updateProfileScreen();
        showScreen(profileScreen);
    });
    backToHomeProfile.addEventListener('click', function () {
        showScreen(modeScreen);
    });

    // Change avatar form
    changeAvatarForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const avatar = changeAvatarForm.querySelector('input[name="profile-avatar"]:checked');
        if (avatar && currentUser) {
            currentUser.avatar = avatar.value;
            updateProfileButton();
            updateProfileScreen();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function () {
        currentUser = null;
        profilePlayerName.textContent = '';
        // Show login screen and reset UI
        showScreen(loginScreen);
        loginForm.reset();
    });

    // Game mode selection
    multiplayerBtn.addEventListener('click', function () {
        showScreen(multiplayerOptions);
    });

    // Multiplayer options
    createRoomBtn.addEventListener('click', function () {
        showScreen(createRoomFormSection);
        roomCodeSection.classList.add('hidden-screen');
    });
    joinRoomBtn.addEventListener('click', function () {
        showScreen(joinRoomFormSection);
    });

    // Back navigation
    backToMode.addEventListener('click', function () {
        showScreen(modeScreen);
    });
    backToMultiplayer.addEventListener('click', function () {
        showScreen(multiplayerOptions);
    });
    backToMultiplayer2.addEventListener('click', function () {
        showScreen(multiplayerOptions);
    });

    // How to Play navigation
    howToPlayBtn.addEventListener('click', function () {
        showScreen(howToPlayScreen);
    });
    backToHome.addEventListener('click', function () {
        showScreen(modeScreen);
    });
    okToHome.addEventListener('click', function () {
        showScreen(modeScreen);
    });

    // Helper to update lobby UI
    function updateLobbyUI() {
        if (!currentRoom) return;
        lobbyRoomCode.textContent = currentRoom.code;
        lobbyAdminAvatar.src = currentRoom.admin.avatar;
        lobbyAdminName.textContent = currentRoom.admin.name;
        // Show/hide slots based on maxPlayers
        for (let i = 0; i < lobbySlots.length; i++) {
            const slot = lobbySlots[i];
            if (i < currentRoom.maxPlayers - 1) {
                slot.style.display = '';
                const player = currentRoom.players[i+1]; // 0 is admin
                const avatarBox = slot.querySelector('.lobby-avatar-box img');
                const nameBox = slot.querySelector('.lobby-player-name');
                if (player) {
                    avatarBox.src = player.avatar;
                    avatarBox.style.opacity = 1;
                    nameBox.textContent = player.name;
                } else {
                    avatarBox.src = 'avatar/add.jpg';
                    avatarBox.alt = 'Add Player';
                    avatarBox.style.opacity = 0.7;
                    nameBox.textContent = 'Waiting...';
                }
            } else {
                slot.style.display = 'none';
            }
        }
        // Show start button only for admin
        lobbyStartBtn.style.display = isAdmin ? 'inline-block' : 'none';
    }

    // Create room form
    roomCreateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Generate a random room code (8 digits)
        const code = (Math.floor(10000000 + Math.random() * 90000000)).toString();
        // Get number of players
        const numPlayers = parseInt(document.getElementById('room-size').value);
        // Create room object
        currentRoom = {
            code,
            admin: { name: currentUser.name, avatar: currentUser.avatar },
            players: [currentUser], // admin is first
            maxPlayers: numPlayers
        };
        isAdmin = true;
        updateLobbyUI();
        // Always show lobby after creating room
        showScreen(lobbyScreen);
    });

    // Join room form (simulate join by code)
    roomJoinForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const code = document.getElementById('join-room-code').value.trim();
        if (code.length > 0) {
            // Simulate finding a room (in-memory only)
            // For demo, just join the last created room if code matches
            if (currentRoom && currentRoom.code === code && currentRoom.players.length < currentRoom.maxPlayers) {
                currentRoom.players.push(currentUser);
                isAdmin = false;
                updateLobbyUI();
                showScreen(lobbyScreen);
            } else {
                alert('Room not found or full.');
            }
        }
    });

    // Copy room code
    copyRoomCodeBtn.addEventListener('click', function () {
        if (currentRoom) {
            navigator.clipboard.writeText(currentRoom.code);
            copyRoomCodeBtn.textContent = '✅';
            setTimeout(() => { copyRoomCodeBtn.textContent = '📋'; }, 1200);
        }
    });

    // Share room URL
    shareRoomUrlBtn.addEventListener('click', function () {
        if (currentRoom) {
            const url = window.location.origin + window.location.pathname + '?room=' + currentRoom.code;
            navigator.clipboard.writeText(url);
            shareRoomUrlBtn.textContent = '✅';
            setTimeout(() => { shareRoomUrlBtn.textContent = '🔗'; }, 1200);
        }
    });

    // Show lobby if ?room=CODE in URL
    function tryAutoJoinFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('room');
        if (code && currentUser) {
            // Simulate join (same as join form)
            if (currentRoom && currentRoom.code === code && currentRoom.players.length < currentRoom.maxPlayers) {
                currentRoom.players.push(currentUser);
                isAdmin = false;
                updateLobbyUI();
                showScreen(lobbyScreen);
            }
        }
    }

    // Start button (admin only)
    lobbyStartBtn.addEventListener('click', function () {
        if (isAdmin && currentRoom && currentRoom.players.length >= 2) {
            alert('Game starting! (Implement game logic here)');
        } else {
            alert('Need at least 2 players to start.');
        }
    });

    // After login, check for auto-join
    loginForm.addEventListener('submit', function () {
        setTimeout(tryAutoJoinFromUrl, 100);
    });

    // === Animated UNO Cards: Randomly Appear and Fall ===
    const cardImages = [
        'cards/+4.jpg', 'cards/b+2.jpg', 'cards/b0.jpg', 'cards/b1.jpg', 'cards/b2.jpg', 'cards/b3.jpg', 'cards/b4.jpg', 'cards/b5.jpg', 'cards/b6.jpg', 'cards/b7.jpg', 'cards/b8.jpg', 'cards/b9.jpg', 'cards/brev.jpg', 'cards/bskip.jpg', 'cards/g+2.jpg', 'cards/g0.jpg', 'cards/g1.jpg', 'cards/g2.jpg', 'cards/g3.jpg', 'cards/g4.jpg', 'cards/g5.jpg', 'cards/g6.jpg', 'cards/g7.jpg', 'cards/g8.jpg', 'cards/g9.jpg', 'cards/grev.jpg', 'cards/gskip.jpg', 'cards/r+2.jpg', 'cards/r0.jpg', 'cards/r1.jpg', 'cards/r2.jpg', 'cards/r3.jpg', 'cards/r4.jpg', 'cards/r5.jpg', 'cards/r6.jpg', 'cards/r7.jpg', 'cards/r8.jpg', 'cards/r9.jpg', 'cards/rrev.jpg', 'cards/rskip.jpg', 'cards/wild.jpg', 'cards/y+2.jpg', 'cards/y0..jpg', 'cards/y1.jpg', 'cards/y2.jpg', 'cards/y3.jpg', 'cards/y4.jpg', 'cards/y5.jpg', 'cards/y6.jpg', 'cards/y7.jpg', 'cards/y8.jpg', 'cards/y9.jpg', 'cards/yrev.jpg', 'cards/yskip.jpg'
    ];
    const animatedBg = document.querySelector('.animated-bg');

    function spawnFallingCard() {
        const card = document.createElement('img');
        card.src = cardImages[Math.floor(Math.random() * cardImages.length)];
        card.className = 'animated-card';
        card.alt = 'UNO Card';
        // Random size for each card (width: 48-90px, height: 75-140px)
        const width = Math.floor(Math.random() * 42) + 48; // 48px to 90px
        const height = Math.floor(width * 1.55); // keep aspect ratio
        card.style.width = width + 'px';
        card.style.height = height + 'px';
        // Random start position anywhere in the viewport
        const startLeft = Math.random() * 90 + 2; // 2vw to 92vw
        const startTop = Math.random() * 80 + 5; // 5vh to 85vh
        card.style.left = startLeft + 'vw';
        card.style.top = startTop + 'vh';
        // Random direction: angle in radians (0 = right, PI/2 = down, PI = left, 3PI/2 = up)
        const angle = Math.random() * 2 * Math.PI;
        // Random distance (in vh/vw)
        const distance = Math.random() * 40 + 30; // 30 to 70 units
        // Calculate end position
        const endLeft = startLeft + Math.cos(angle) * distance;
        const endTop = startTop + Math.sin(angle) * distance;
        // Clamp to viewport
        const endLeftClamped = Math.max(0, Math.min(95, endLeft));
        const endTopClamped = Math.max(0, Math.min(95, endTop));
        // Random rotation
        const rot = (Math.random() * 40 - 20); // -20deg to +20deg
        card.style.transform = `rotate(${rot}deg)`;
        // Random duration
        const duration = Math.random() * 8 + 14;
        // Animate with transition
        card.style.transition = `left ${duration}s linear, top ${duration}s linear, opacity 1.5s`;
        card.style.opacity = 0.92;
        animatedBg.appendChild(card);
        // Animate to end position after a short delay (to trigger transition)
        setTimeout(() => {
            card.style.left = endLeftClamped + 'vw';
            card.style.top = endTopClamped + 'vh';
            card.style.opacity = 0.15;
        }, 50);
        // Remove card after animation
        setTimeout(() => { card.remove(); }, duration * 1000 + 1000);
    }
    // Spawn a card at a random interval between ~960ms and ~1760ms for 30% more density
    function startRandomCardSpawner() {
        spawnFallingCard();
        const next = Math.random() * 800 + 960; // 960ms to 1760ms (30% faster than original)
        setTimeout(startRandomCardSpawner, next);
    }
    startRandomCardSpawner();

    // Lobby back button logic
    const lobbyBackBtn = document.getElementById('lobby-back-btn');
    if (lobbyBackBtn) {
        lobbyBackBtn.addEventListener('click', function () {
            // Return to multiplayer options and reset lobby state
            showScreen(multiplayerOptions);
            currentRoom = null;
            isAdmin = false;
            updateLobbyUI();
        });
    }
});
