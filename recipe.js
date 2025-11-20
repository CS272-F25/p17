function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function renderOverview(recipe) {
  const titleEl = document.getElementById("recipe-title");
  const descEl = document.getElementById("overview-description");
  const heroContainer = document.getElementById("overview-hero");
  const metaContainer = document.getElementById("overview-meta");
  const tagsContainer = document.getElementById("overview-tags");

  if (titleEl) titleEl.textContent = recipe.title || "";
  if (descEl) descEl.textContent = recipe.description || "";

  // hero image
  clearElement(heroContainer);
  if (recipe.image && recipe.image.src) {
    const img = document.createElement("img");
    img.src = recipe.image.src;
    img.alt = recipe.image.alt || recipe.title || "";
    heroContainer.appendChild(img);
  }

  // meta: yield + time
  clearElement(metaContainer);

  if (recipe.yield) {
    const chip = document.createElement("div");
    chip.className = "meta-chip";

    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-people");

    const span = document.createElement("span");
    span.textContent = recipe.yield;

    chip.appendChild(icon);
    chip.appendChild(span);
    metaContainer.appendChild(chip);
  }

  if (recipe.time && typeof recipe.time === "object") {
    Object.entries(recipe.time).forEach(([label, value]) => {
      const chip = document.createElement("div");
      chip.className = "meta-chip";

      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-clock");

      const span = document.createElement("span");
      span.textContent = `${label}: ${value}`;

      chip.appendChild(icon);
      chip.appendChild(span);
      metaContainer.appendChild(chip);
    });
  }

  // tags
  clearElement(tagsContainer);
  if (Array.isArray(recipe.tags)) {
    recipe.tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "tag-pill";
      pill.textContent = tag;
      tagsContainer.appendChild(pill);
    });
  }
}

function renderIngredients(recipe) {
  const wrapper = document.getElementById("ingredients-wrapper");
  if (!wrapper) return;
  clearElement(wrapper);

  const listContainer = document.createElement("div");
  listContainer.className = "ingredients-list";

  const ul = document.createElement("ul");

  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((ing) => {
      const li = document.createElement("li");

      const amount = ing.amount;
      const unit = ing.unit;
      let text = ing.name || "";

      if (amount != null && amount !== "") {
        const amountStr =
          typeof amount === "number" ? amount.toString() : String(amount);
        if (unit) {
          text = `${amountStr} ${unit} ${text}`;
        } else {
          text = `${amountStr} ${text}`;
        }
      }

      li.textContent = text;
      ul.appendChild(li);
    });
  }

  listContainer.appendChild(ul);
  wrapper.appendChild(listContainer);

  const hasImage = recipe.ingredientsImage && recipe.ingredientsImage.src;
  if (hasImage) {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "ingredients-image";

    const img = document.createElement("img");
    img.src = recipe.ingredientsImage.src;
    img.alt =
      recipe.ingredientsImage.alt || "Ingredients laid out for this recipe.";

    imgWrapper.appendChild(img);
    wrapper.appendChild(imgWrapper);
  }
}

function renderInstructions(recipe) {
  const list = document.getElementById("instructions-list");
  clearElement(list);

  if (!Array.isArray(recipe.instructions)) return;

  recipe.instructions.forEach((stepObj) => {
    const stepEl = document.createElement("div");
    stepEl.className = "instruction-step";
    stepEl.id = `step-${stepObj.step}`;

    const hasMedia =
      Array.isArray(stepObj.media) && stepObj.media.length > 0;

    if (hasMedia && stepObj.media.length === 1) {
      stepEl.classList.add("instruction-step--single-media");
    } else if (hasMedia && stepObj.media.length > 1) {
      stepEl.classList.add("instruction-step--multi-media");
    }

    const header = document.createElement("div");
    header.className = "instruction-step-header";

    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = `Step ${stepObj.step}`;

    const textP = document.createElement("p");
    textP.className = "step-text";
    textP.textContent = stepObj.text || "";

    header.appendChild(number);
    header.appendChild(textP);
    stepEl.appendChild(header);

    // media
    if (hasMedia) {
      const mediaRow = document.createElement("div");
      mediaRow.className = "step-media-row";

      stepObj.media.forEach((m) => {
        if (!m.src) return;
        const item = document.createElement("div");
        item.className = "step-media-item";

        const img = document.createElement("img");
        img.src = m.src;
        img.alt = m.alt || `Step ${stepObj.step} image`;

        item.appendChild(img);
        mediaRow.appendChild(item);
      });

      stepEl.appendChild(mediaRow);
    }

    list.appendChild(stepEl);
  });
}

function renderNotes(recipe) {
  const list = document.getElementById("notes-list");
  clearElement(list);

  if (!Array.isArray(recipe.notes) || recipe.notes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No additional notes for this recipe.";
    list.appendChild(p);
    return;
  }

  recipe.notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
}

function setupOutline() {
  const outlineItems = Array.from(
    document.querySelectorAll(".outline-item")
  );
  const sectionIds = ["overview", "ingredients", "instructions", "notes"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!outlineItems.length || !sections.length) return;

  const setActive = (id) => {
    outlineItems.forEach((btn) => {
      const isActive = btn.dataset.target === id;
      btn.classList.toggle("outline-item--active", isActive);
    });
  };

  let currentActiveId = "overview";
  setActive(currentActiveId);

  let isProgrammaticScroll = false;
  let scrollLockTimer = null;
  const SCROLL_LOCK_MS = 500;
  const SCROLL_OFFSET = 96;

  outlineItems.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      currentActiveId = targetId;
      setActive(targetId);

      isProgrammaticScroll = true;
      if (scrollLockTimer) clearTimeout(scrollLockTimer);
      scrollLockTimer = setTimeout(() => {
        isProgrammaticScroll = false;
      }, SCROLL_LOCK_MS);

      const rect = targetSection.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - SCROLL_OFFSET;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  let ticking = false;

  const updateActiveOnScroll = () => {
    ticking = false;
    if (isProgrammaticScroll) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight * 0.5; 

    const doc = document.documentElement;
    const viewportBottom = scrollY + viewportHeight;
    const pageBottom = doc.scrollHeight;

    const TOP_THRESHOLD = 40;     
    const BOTTOM_THRESHOLD = 64; 

    if (scrollY < TOP_THRESHOLD) {
      if (currentActiveId !== "overview") {
        currentActiveId = "overview";
        setActive("overview");
      }
      return;
    }

    if (pageBottom - viewportBottom < BOTTOM_THRESHOLD) {
      const lastSection = sections[sections.length - 1];
      if (lastSection && currentActiveId !== lastSection.id) {
        currentActiveId = lastSection.id;
        setActive(lastSection.id);
      }
      return;
    }

    let bestId = null;
    let bestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = section.id;
      }
    });

    if (bestId && bestId !== currentActiveId) {
      currentActiveId = bestId;
      setActive(bestId);
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateActiveOnScroll);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  updateActiveOnScroll();
}




async function loadRecipePage() {
  const id = getRecipeIdFromUrl();
  const errorEl = document.getElementById("recipe-error");

  if (!id) {
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = "No recipe ID provided in the URL.";
    }
    return;
  }

  try {
    const res = await fetch("recipes.json");
    const recipes = await res.json();
    const recipe = recipes.find((r) => r.id === id);

    if (!recipe) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = "Recipe not found.";
      }
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    renderOverview(recipe);
    renderIngredients(recipe);
    renderInstructions(recipe);
    renderNotes(recipe);
    setupOutline();
  } catch (err) {
    console.error(err);
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = "Failed to load recipe data.";
    }
  }
}

document.addEventListener("DOMContentLoaded", loadRecipePage);
