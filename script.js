document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const startBtn = document.getElementById('startBtn');
  const welcomeSection = document.getElementById('welcomeSection');
  const formSection = document.getElementById('formSection');
  const wishSection = document.getElementById('wishSection');
  const gameSection = document.getElementById('gameSection');

  const diwaliForm = document.getElementById('diwaliForm');
  const wishText = document.getElementById('wishText');

  const spinBtn = document.getElementById('spinBtn');
  const resultNumber = document.getElementById('resultNumber');
  const resultText = document.getElementById('resultText');
  const doneBtn = document.getElementById('doneBtn');

  let lastFormData = {};
  let lastGameNumber = null;
  let lastPrize = 'None';

  // =========
  // Sounds
  // =========
  const wishSound = new Audio('sounds/happy.mp3'); // Diwali wish music
  const winSound = new Audio('sounds/win.mp3');           // Game win
  const loseSound = new Audio('sounds/lose.mp3');         // Game lose

  // =========
  // 1️⃣ Start button
  // =========
  startBtn.addEventListener('click', () => {
    welcomeSection.classList.add('hidden');
    formSection.classList.remove('hidden');
  });

  // =========
  // 2️⃣ Form submit
  // =========
  diwaliForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(diwaliForm);
    const name = formData.get('name').trim();
    const relation = formData.get('relation');
    const message = formData.get('message').trim();
    const upi = formData.get('upi').trim();

    if (relation === 'Girlfriend') {
      alert("Rohit doesn't have any girlfriend 😎 — please choose another option!");
      return;
    }

    lastFormData = { name, relation, message, upi };

    // Generate wish text
    const wishMessage = generateWishText(name, relation);
    wishText.textContent = wishMessage;

    // 🎵 Play Diwali wish sound
    wishSound.currentTime = 0;
    wishSound.play();

    // Backend POST
    try {
      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, message, upi })
      });
      const result = await response.json();
      if (!result.success) console.error('Email send failed:', result.error);
      else console.log('Email sent successfully!');
    } catch (err) {
      console.error('Fetch error:', err);
    }

    formSection.classList.add('hidden');
    wishSection.classList.remove('hidden');

    // Start Firecracker effect
    startFirecrackerEffect();
  });

  // =========
  // 3️⃣ Game logic
  // =========
  spinBtn.addEventListener('click', () => {
    spinBtn.disabled = true;

    gameSection.classList.remove('hidden');
    wishSection.classList.add('hidden');

    resultNumber.textContent = '🎡';
    resultText.textContent = 'Spinning...';

    setTimeout(() => {
      const number = Math.floor(Math.random() * 10) + 1;
      resultNumber.textContent = number;

      let prize = 'None';
      if (number === 7) prize = '₹50 eGold / Cash';
      else if (number === 2) prize = '₹11 Cash';

      resultText.textContent =
        prize === 'None'
          ? `You got ${number}. Better luck next time 😜`
          : `🎉 You got ${number}! ${prize} 🎁`;

      doneBtn.classList.remove('hidden');

      // ✅ Store values in JS variables
      lastGameNumber = number;
      lastPrize = prize;

      // 🎵 Play win/lose sound
      if (prize !== 'None') {
        winSound.currentTime = 0;
        winSound.play();
      } else {
        loseSound.currentTime = 0;
        loseSound.play();
      }
    }, 1500);
  });

  // =========
  // 4️⃣ Done button
  // =========
  doneBtn.addEventListener('click', async () => {
    const { name, relation, message, upi } = lastFormData;

    try {
      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          relation,
          message,
          upi,
          gameNumber: lastGameNumber,
          prize: lastPrize
        })
      });

      const result = await response.json();
      if (!result.success) console.error('Email send failed:', result.error);
      else console.log('Email sent successfully!');
    } catch (err) {
      console.error('Fetch error:', err);
    }

    alert('Thanks for participating! Enjoy the festival 🎆');
    window.location.reload();
  });

  // =========
  // Generate random Diwali wish
  // =========
  function generateWishText(name, relation) {
    const wishes = {
      Friend: [
        `Hey ${name}! Wishing you a sparkling Diwali full of fun and laughter 🪔✨`,
        `Dear ${name}, hope this Diwali brings endless joy and sweets 🍬🪔`,
        `Happy Diwali ${name}! Let's celebrate with lights and laughter 🪔🎉`,
        `${name}, may your Diwali be full of happiness and cool vibes ✨🪔`,
        `Cheers ${name}! Have a blast this Diwali with your friends 🪔🥳`
      ],
      Relative: [
        `Dear ${name}, wishing you and your family a warm, joyful Diwali filled with blessings 🙏✨`,
        `Happy Diwali ${name}! May love and light surround your home 🪔❤️`,
        `Wishing you prosperity and happiness this Diwali ${name} 🪔💫`,
        `${name}, may your Diwali be bright and full of family joy 🎇🪔`,
        `Happy Diwali to you and your loved ones ${name}! 🪔🎉`
      ],
      Colleague: [
        `${name}, may this Diwali bring success, peace, and light to your life 💼🪔`,
        `Happy Diwali ${name}! Wishing you a prosperous year ahead 🪔✨`,
        `${name}, may your career and life shine bright this Diwali 🎇💼`,
        `Wishing you professional and personal joy this Diwali ${name} 🪔💫`,
        `Have a sparkling and stress-free Diwali, ${name}! 🪔🎉`
      ],
      Sibling: [
        `Oye ${name}! Khush rehna... par yaad rakh Diwali ke gifts mujhe chahiye 😎🪔`,
        `${name}, may your Diwali be full of fun, sweets, and laughter 🪔🍬`,
        `Happy Diwali ${name}! Don't forget to save some mithai for me 🎇🪔`,
        `Diwali vibes for you ${name} 🎆🪔 Enjoy and stay safe!`,
        `${name}, let's light up the house together this Diwali 🪔❤️`
      ],
      Crush: [
        `Hey ${name}... Happy Diwali 😳✨ Maybe next Diwali together? 💫`,
        `${name}, may this Diwali be as sweet as your smile 🪔❤️`,
        `Wishing you sparkles, sweets, and happiness this Diwali ${name} 🪔🎇`,
        `Happy Diwali ${name}! Can't wait to celebrate together someday 💫🪔`,
        `May this Diwali bring you closer to all your dreams, including me 😉🪔`
      ],
      Bestiee: [
        `${name}! You are my Patakha 🎆, You're my Phuljhadi🎇,Ghar sey Bahar Mat Nikalna 👧 Warna Lag Jayegi Agarbatti 🥢🪔🪷 Happy Dill ❤️ wali Diwali bestiee🦋⃟💗᪲᪲᪲`,
        `Bestie ${name}, let's light up the world like we light up each other's lives 🎉💜`,
        `${name}, our friendship is the brightest spark this Diwali 🪔✨`,
        `Happy Diwali ${name}! May we binge sweets and laugh all day 🍬🪔`,
        `${name}, Diwali without you is like fireworks without spark 🎇🪔`
      ]
    };

    const selectedWishes = wishes[relation] || wishes.Friend;
    const randomIndex = Math.floor(Math.random() * selectedWishes.length);
    return selectedWishes[randomIndex];
  }

  // =========
  // Firecracker effect
  // =========
  function startFirecrackerEffect() {
    const container = document.getElementById('firecrackerContainer');
    const emojis = ['🎆', '🎇', '✨', '🪔','❤️'];

    function createFirecracker() {
      const firecracker = document.createElement('div');
      firecracker.className = 'firecracker';
      firecracker.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      firecracker.style.left = Math.random() * 100 + 'vw';
      container.appendChild(firecracker);

      setTimeout(() => {
        if (firecracker.parentNode) firecracker.parentNode.removeChild(firecracker);
      }, 4000);
    }

    // Spawn every 200-500ms
    setInterval(createFirecracker, Math.random() * 300 + 200);
  }
startFirecrackerEffect();
});

