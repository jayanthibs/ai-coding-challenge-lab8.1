// Flashcards App with Deck Management
class FlashcardsApp {
  constructor() {
    this.activeDeckId = 1;
    this.currentCardIndex = 0;
    this.decks = [
      {
        id: 1,
        name: "Spanish Vocabulary",
        cards: [
          { id: 1, front: "Hola", back: "Hello" },
          { id: 2, front: "Adiós", back: "Goodbye" },
          { id: 3, front: "Gracias", back: "Thank you" },
          { id: 4, front: "Por favor", back: "Please" },
          { id: 5, front: "Sí", back: "Yes" },
          { id: 6, front: "No", back: "No" },
          { id: 7, front: "Agua", back: "Water" },
          { id: 8, front: "Gato", back: "Cat" },
          { id: 9, front: "Perro", back: "Dog" },
          { id: 10, front: "Casa", back: "House" },
          { id: 11, front: "Libro", back: "Book" },
          { id: 12, front: "Computadora", back: "Computer" },
        ],
      },
      {
        id: 2,
        name: "History Facts",
        cards: [
          {
            id: 1,
            front: "Who was the first president?",
            back: "George Washington",
          },
          { id: 2, front: "When did WWII end?", back: "1945" },
          { id: 3, front: "Capital of France", back: "Paris" },
          { id: 4, front: "Who wrote Hamlet?", back: "William Shakespeare" },
          { id: 5, front: "Year of moon landing", back: "1969" },
          { id: 6, front: "First emperor of Rome", back: "Augustus" },
          { id: 7, front: "What year was the wheel invented?", back: "3500 BC" },
          { id: 8, front: "Author of 1984", back: "George Orwell" },
        ],
      },
      {
        id: 3,
        name: "Biology Concepts",
        cards: [
          {
            id: 1,
            front: "What is photosynthesis?",
            back: "Process plants use to convert light into energy",
          },
          {
            id: 2,
            front: "What is mitochondria?",
            back: "Powerhouse of the cell",
          },
          { id: 3, front: "What are proteins?", back: "Building blocks of life" },
          {
            id: 4,
            front: "What is DNA?",
            back: "Molecule carrying genetic instructions",
          },
          { id: 5, front: "Define osmosis", back: "Movement of water across membrane" },
          { id: 6, front: "What is ATP?", back: "Energy currency of the cell" },
          { id: 7, front: "What is enzyme?", back: "Protein that speeds up reactions" },
          {
            id: 8,
            front: "What is homeostasis?",
            back: "Maintaining stable internal conditions",
          },
          { id: 9, front: "Define photosynthesis equation", back: "6CO2 + 6H2O → C6H12O6 + 6O2" },
          { id: 10, front: "What is chlorophyll?", back: "Green pigment in plants" },
          { id: 11, front: "What is respiration?", back: "Process to release energy from glucose" },
          {
            id: 12,
            front: "What are chromosomes?",
            back: "Structures containing DNA",
          },
          { id: 13, front: "Define evolution", back: "Change in organisms over time" },
          { id: 14, front: "What is mutation?", back: "Change in DNA sequence" },
          { id: 15, front: "What is adaptation?", back: "Trait helping survival" },
        ],
      },
    ];

    this.nextDeckId = 4;
    this.editingDeckId = null;
    this.deletingDeckId = null;

    this.initializeEventListeners();
    this.renderDeckList();
    this.selectDeck(1);
  }

  initializeEventListeners() {
    // New Deck button
    document
      .querySelector(".btn-header-new-deck")
      .addEventListener("click", () => this.openNewDeckModal());

    // Modal close buttons
    document.querySelectorAll(".btn-close-modal").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.target.closest(".modal-overlay").classList.remove("active");
      });
    });

    // New Deck form
    document
      .getElementById("newDeckForm")
      .addEventListener("submit", (e) => this.handleNewDeckSubmit(e));

    document
      .querySelector("#newDeckModal .btn-cancel")
      .addEventListener("click", () => {
        document.getElementById("newDeckModal").classList.remove("active");
      });

    // Edit Deck form
    document
      .getElementById("editDeckForm")
      .addEventListener("submit", (e) => this.handleEditDeckSubmit(e));

    document
      .querySelector("#editDeckModal .btn-cancel")
      .addEventListener("click", () => {
        document.getElementById("editDeckModal").classList.remove("active");
      });

    // Delete confirmation
    document
      .querySelector("#confirmDeleteModal .btn-cancel")
      .addEventListener("click", () => {
        document.getElementById("confirmDeleteModal").classList.remove("active");
      });

    document
      .querySelector(".btn-delete-confirm")
      .addEventListener("click", () => this.confirmDelete());

    // Deck edit/delete buttons in header
    document
      .querySelector(".btn-edit-deck")
      .addEventListener("click", () => this.openEditDeckModal(this.activeDeckId));

    document
      .querySelector(".btn-delete-deck")
      .addEventListener("click", () =>
        this.openDeleteConfirm(this.activeDeckId)
      );

    // Modal overlay click to close
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
        }
      });
    });

    // Card navigation
    document
      .querySelector(".btn-prev")
      .addEventListener("click", () => this.previousCard());
    document
      .querySelector(".btn-next")
      .addEventListener("click", () => this.nextCard());
    document
      .querySelector(".btn-flip")
      .addEventListener("click", () => this.flipCard());

    // Card click to flip
    document
      .querySelector(".card")
      .addEventListener("click", () => this.flipCard());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousCard();
      if (e.key === "ArrowRight") this.nextCard();
      if (e.key === " ") {
        e.preventDefault();
        this.flipCard();
      }
    });
  }

  renderDeckList() {
    const deckList = document.querySelector(".deck-list");
    deckList.innerHTML = "";

    this.decks.forEach((deck) => {
      const li = document.createElement("li");
      li.className = `deck-item ${deck.id === this.activeDeckId ? "active" : ""}`;

      li.innerHTML = `
        <div class="deck-item-content">
          <a href="#" data-deck-id="${deck.id}" class="deck-link">${deck.name}</a>
          <span class="card-badge">${deck.cards.length}</span>
        </div>
        <div class="deck-item-actions">
          <button class="btn-deck-menu" title="Deck options" aria-label="Deck options">⋮</button>
        </div>
      `;

      const deckLink = li.querySelector(".deck-link");
      deckLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.selectDeck(deck.id);
      });

      const menuBtn = li.querySelector(".btn-deck-menu");
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openDeckMenu(e, deck.id);
      });

      deckList.appendChild(li);
    });

    this.updateDeckCount();
  }

  updateDeckCount() {
    document.querySelector(".deck-count").textContent = this.decks.length;
  }

  selectDeck(deckId) {
    const deck = this.decks.find((d) => d.id === deckId);
    if (!deck) return;

    this.activeDeckId = deckId;
    this.currentCardIndex = 0;

    // Update active state
    document.querySelectorAll(".deck-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`.deck-item [data-deck-id="${deckId}"]`)
      .closest(".deck-item")
      .classList.add("active");

    // Update main content
    document.getElementById("deck-title").textContent = deck.name;
    document.querySelector(".deck-stats").textContent = `${deck.cards.length} cards`;
    document.querySelector(".total-cards").textContent = deck.cards.length;

    this.renderCard();
  }

  renderCard() {
    const deck = this.decks.find((d) => d.id === this.activeDeckId);
    if (!deck || deck.cards.length === 0) return;

    const card = deck.cards[this.currentCardIndex];
    document.querySelector(".card-front p").textContent = card.front;
    document.querySelector(".card-back p").textContent = card.back;
    document.querySelector(".current-card").textContent =
      this.currentCardIndex + 1;
    document.querySelector(".card-count").textContent = this.currentCardIndex + 1;

    const progress = ((this.currentCardIndex + 1) / deck.cards.length) * 100;
    document.querySelector(".progress-fill").style.width = progress + "%";

    this.resetCardFlip();
  }

  nextCard() {
    const deck = this.decks.find((d) => d.id === this.activeDeckId);
    if (this.currentCardIndex < deck.cards.length - 1) {
      this.currentCardIndex++;
      this.renderCard();
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.renderCard();
    }
  }

  flipCard() {
    const cardInner = document.querySelector(".card-inner");
    const isFlipped =
      cardInner.style.transform === "rotateY(180deg)" ||
      cardInner.style.transform === "";
    cardInner.style.transform = isFlipped
      ? "rotateY(180deg)"
      : "rotateY(0deg)";
  }

  resetCardFlip() {
    document.querySelector(".card-inner").style.transform = "rotateY(0deg)";
  }

  openNewDeckModal() {
    document.getElementById("newDeckForm").reset();
    document.getElementById("newDeckModal").classList.add("active");
    document.getElementById("deckNameInput").focus();
  }

  handleNewDeckSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("deckNameInput").value.trim();

    if (name) {
      const newDeck = {
        id: this.nextDeckId++,
        name: name,
        cards: [],
      };

      this.decks.push(newDeck);
      this.renderDeckList();
      this.selectDeck(newDeck.id);
      document.getElementById("newDeckModal").classList.remove("active");
    }
  }

  openEditDeckModal(deckId) {
    const deck = this.decks.find((d) => d.id === deckId);
    if (!deck) return;

    this.editingDeckId = deckId;
    document.getElementById("editDeckNameInput").value = deck.name;
    document.getElementById("editDeckModal").classList.add("active");
    document.getElementById("editDeckNameInput").focus();
  }

  handleEditDeckSubmit(e) {
    e.preventDefault();
    const newName = document.getElementById("editDeckNameInput").value.trim();

    if (newName && this.editingDeckId) {
      const deck = this.decks.find((d) => d.id === this.editingDeckId);
      if (deck) {
        deck.name = newName;
        this.renderDeckList();
        if (this.activeDeckId === this.editingDeckId) {
          document.getElementById("deck-title").textContent = newName;
        }
        document.getElementById("editDeckModal").classList.remove("active");
      }
    }
  }

  openDeleteConfirm(deckId) {
    const deck = this.decks.find((d) => d.id === deckId);
    if (!deck) return;

    this.deletingDeckId = deckId;
    document.getElementById("deleteConfirmMessage").textContent =
      `Are you sure you want to delete "${deck.name}"? This action cannot be undone.`;
    document.getElementById("confirmDeleteModal").classList.add("active");
  }

  confirmDelete() {
    if (this.deletingDeckId) {
      this.decks = this.decks.filter((d) => d.id !== this.deletingDeckId);

      if (this.activeDeckId === this.deletingDeckId) {
        const firstDeck = this.decks[0];
        this.selectDeck(firstDeck ? firstDeck.id : null);
      }

      this.renderDeckList();
      document.getElementById("confirmDeleteModal").classList.remove("active");
    }
  }

  openDeckMenu(event, deckId) {
    const dropdown = document.getElementById("deckMenuDropdown");
    const rect = event.target.getBoundingClientRect();

    dropdown.style.top = rect.bottom + "px";
    dropdown.style.left = rect.left - 100 + "px";
    dropdown.classList.add("active");

    // Store current deck ID for menu actions
    dropdown.dataset.deckId = deckId;

    document.getElementById("editDeckOption").onclick = () => {
      this.openEditDeckModal(deckId);
      dropdown.classList.remove("active");
    };

    document.getElementById("deleteDeckOption").onclick = () => {
      this.openDeleteConfirm(deckId);
      dropdown.classList.remove("active");
    };
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  new FlashcardsApp();

  // Close deck menu when clicking outside
  document.addEventListener("click", () => {
    const dropdown = document.getElementById("deckMenuDropdown");
    if (dropdown) {
      dropdown.classList.remove("active");
    }
  });
});