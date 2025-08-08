// DOM Elements
const nameInput = document.getElementById('nameInput');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewWrap = document.getElementById('previewWrap');
const roastBtn = document.getElementById('roastBtn');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const roastContent = document.getElementById('roastContent');
const newRoastBtn = document.getElementById('newRoastBtn');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const inputSection = document.querySelector('.input-section');

// Sample roasts for images (in a real app, these would come from an AI API)
const imageRoasts = [
    "Alright, let's get cooking! 😈\n\nBro, this looks like you went to the barber and just asked for the \"WiFi signal\" haircut. Your hair's got more waves than a pandemic graph 📈. That shirt is so aggressively basic it's about to get recruited by Microsoft Excel. You look like you spent 10 minutes practicing your \"serious professional\" face in the mirror, and STILL ended up looking like a confused substitute teacher.\n\nThis photo's giving off strong \"I Google how to tie a tie every wedding season\" vibes. 😂 Get your act together, LinkedIn is watching!",
    
    "Oh boy, where do I even start? 🔥\n\nYour hair looks like it's trying to signal aliens with those perfect waves, and that shirt is so aggressively plaid it's basically a spreadsheet in fabric form. You've got that \"I practiced this serious face in the mirror for 10 minutes\" energy that screams \"please hire me, I'm very professional!\" 😂\n\nThis is the kind of photo that makes HR departments nervous. You look like you're one step away from asking if the company has a casual Friday policy.",
    
    "Let me take a good look at this masterpiece... 😏\n\nYour hair is giving major \"I just discovered hair gel\" energy, and that shirt pattern is so busy it's practically having a conversation with itself. You look like you're trying to convince everyone you're a serious adult while your inner child is screaming for help.\n\nThis photo screams \"I read a LinkedIn article about professional headshots and took it way too literally.\" The background is probably a white wall you found in your apartment, and you're definitely not making eye contact with the camera because you're too busy thinking about your next LinkedIn post.",
    
    "Alright, let's roast this photo! 🔥\n\nYour hair looks like it's been styled by a confused barber who just discovered the concept of \"volume,\" and that shirt is so aggressively patterned it's basically a visual assault. You've got that \"I'm trying really hard to look professional\" expression that just screams \"I'm not sure what I'm doing here.\"\n\nThis is the kind of photo that makes people wonder if you actually know how to smile, or if you're just permanently stuck in \"serious business mode.\" You look like you're about to give a presentation about quarterly reports to a room full of people who don't care.",
    
    "Oh my, what do we have here? 😈\n\nYour hair is giving major \"I just discovered hair products\" energy, and that shirt pattern is so busy it's practically having an identity crisis. You look like you're trying to convince everyone you're a grown-up while your inner teenager is desperately trying to break free.\n\nThis photo has strong \"I Googled 'professional headshot tips' and took them way too seriously\" vibes. You're probably standing in front of a white wall in your apartment, trying to look like you belong in a corporate brochure."
];

// Sample roasts for names
const nameRoasts = [
    "Oh boy, {name}... where do I even begin? 😈\n\nYou've got a name that sounds like it was picked by parents who were either really optimistic or really confused about what makes a good name. {name}? More like \"{name}-n't\" because you definitely can't handle this roast! 😂\n\nYour name is giving major \"I was named after a character from a book my mom read while pregnant\" energy. It's like your parents were trying to be unique but ended up being... well, you know what they say about the apple not falling far from the tree!",
    
    "Alright {name}, let's get this over with! 🔥\n\nYour name is so basic it's practically a placeholder. \"{name}\" - sounds like something you'd name a pet rock or a houseplant you're not sure you want to keep alive. It's giving \"I was named in under 30 seconds\" vibes.\n\nI bet your parents spent more time picking out what to have for dinner than they did naming you. {name}? More like \"{name}-less\" because you clearly lack the creativity to come up with something better! 😂",
    
    "Well well well, look who we have here - {name}! 😏\n\nYour name is giving major \"I was named by committee\" energy. It's like your entire family got together and said, \"Let's pick the most average name possible.\" {name}? Sounds like something you'd call a default character in a video game you haven't customized yet.\n\nI can just picture your parents looking at you as a baby and going, \"Eh, {name} will do.\" It's the kind of name that makes people forget you exist five minutes after meeting you. Sorry not sorry! 😈",
    
    "Oh {name}, you poor thing! 🔥\n\nYour name is so forgettable it's practically a memory test. \"{name}\" - it's like your parents were trying to make you blend into the background. It's giving \"I was named by someone who was really tired\" energy.\n\nI bet when you introduce yourself, people are like, \"{name}? That's a name?\" It's the kind of name that makes you wonder if your parents were actually excited about having a child or if they just went with the first thing that came to mind.\n\n{name}? More like \"{name}-tastic\" because you're definitely not! 😂",
    
    "Let me take a moment to appreciate the masterpiece that is your name, {name}! 😈\n\nYour name is giving major \"I was named by someone who was really into generic things\" energy. {name}? It's like your parents were playing a game of \"How Basic Can We Make This?\" and they won by a landslide.\n\nIt's the kind of name that makes people do a double-take and think, \"Wait, that's actually their name?\" {name} sounds like something you'd name a placeholder variable in code - temporary and forgettable.\n\nBut hey, at least your name matches your personality - completely unremarkable! 😂"
];

let currentImage = null;

// Event Listeners
roastBtn.addEventListener('click', handleRoastRequest);
newRoastBtn.addEventListener('click', resetAndShowInput);
retryBtn.addEventListener('click', resetAndShowInput);

// Image input event listener
imageInput.addEventListener('change', handleImageSelect);

// Name input event listener
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleRoastRequest();
    }
});

// Image selection handler
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) {
        previewWrap.style.display = 'none';
        imagePreview.src = '';
        currentImage = null;
        updateRoastButtonState();
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file (JPG, PNG, etc.).');
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image file is too large. Please select an image under 5MB.');
        return;
    }
    
    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    currentImage = file;
    
    // Update UI
    imagePreview.src = imageUrl;
    previewWrap.style.display = 'block';
    
    // Update roast button state
    updateRoastButtonState();
}

// Update roast button state
function updateRoastButtonState() {
    const name = nameInput.value.trim();
    const hasImage = currentImage !== null;
    
    if (name || hasImage) {
        roastBtn.disabled = false;
    } else {
        roastBtn.disabled = true;
    }
}

// Main function to handle roast request
async function handleRoastRequest() {
    const name = nameInput.value.trim();
    
    // Validation - either name or image required
    if (!name && !currentImage) {
        showError('Please enter a name or upload an image to roast! 😅');
        return;
    }
    
    if (name && name.length > 50) {
        showError('That name is too long! Keep it simple, like your personality! 😂');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        let roast;
        
        if (currentImage) {
            // Use image roasts
            roast = imageRoasts[Math.floor(Math.random() * imageRoasts.length)];
        } else {
            // Use name roasts
            const nameRoast = nameRoasts[Math.floor(Math.random() * nameRoasts.length)];
            roast = nameRoast.replace(/{name}/g, name);
        }
        
        showResult(roast);
    } catch (error) {
        console.error('Error getting roast:', error);
        showError('Oops! The AI is having a moment. Maybe it\'s too shocked! 😅');
    }
}

// Function to show loading state
function showLoading() {
    hideAllSections();
    loadingSection.style.display = 'block';
    roastBtn.disabled = true;
}

// Function to show result
function showResult(roast) {
    hideAllSections();
    roastContent.textContent = roast;
    resultSection.style.display = 'block';
    roastBtn.disabled = false;
}

// Function to show error
function showError(message) {
    hideAllSections();
    errorText.textContent = message;
    errorSection.style.display = 'block';
    roastBtn.disabled = false;
}

// Function to hide all sections
function hideAllSections() {
    inputSection.style.display = 'block';
    loadingSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Function to reset and show input section
function resetAndShowInput() {
    hideAllSections();
    nameInput.value = '';
    imageInput.value = '';
    previewWrap.style.display = 'none';
    imagePreview.src = '';
    currentImage = null;
    nameInput.focus();
    roastBtn.disabled = true;
}

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Disable roast button initially
    roastBtn.disabled = true;
    
    // Add typing effect to title
    const title = document.querySelector('.title');
    title.style.opacity = '0';
    title.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        title.style.transition = 'all 0.8s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 300);
    
    // Add hover effect to input
    nameInput.addEventListener('focus', () => {
        nameInput.style.transform = 'scale(1.02)';
    });
    
    nameInput.addEventListener('blur', () => {
        nameInput.style.transform = 'scale(1)';
    });
    
    // Add input change listener for roast button state
    nameInput.addEventListener('input', updateRoastButtonState);
    
    // Add some fun random emojis to the roast button on hover
    roastBtn.addEventListener('mouseenter', () => {
        const emojis = ['🔥', '��', '😈', '⚡', '💥', '🎭', '🤡', '👻'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        roastBtn.innerHTML = `🔥 ROAST ME! ${randomEmoji} 🔥`;
    });
    
    roastBtn.addEventListener('mouseleave', () => {
        roastBtn.innerHTML = '🔥 ROAST ME! 🔥';
    });
});

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.title').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🔥 You really like clicking things, don\'t you? Maybe that\'s why you need this roast! 🔥');
        clickCount = 0;
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to roast
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !roastBtn.disabled) {
        e.preventDefault();
        handleRoastRequest();
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        resetAndShowInput();
    }
});

// Add some fun console messages
console.log('🔥 Roast Me AI loaded! 🔥');
console.log('💡 Tips: Press Ctrl+Enter to roast, Escape to reset');
console.log('🎭 Remember: It\'s all in good fun! (mostly) 😈');

