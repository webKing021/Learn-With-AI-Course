const form = document.getElementById("placeForm");
const input = document.getElementById("placeInput");
const list = document.getElementById("placeList");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const placeName = input.value.trim();
  if (placeName === "") return;

  addPlace(placeName);
  input.value = "";
});

function addPlace(name) {
  const li = document.createElement("li");
  li.className = "place-item";

  const placeSpan = document.createElement("span");
  placeSpan.className = "place-name";
  placeSpan.textContent = name;

  const voteSection = document.createElement("div");
  voteSection.className = "vote-section";

  const voteBtn = document.createElement("button");
  voteBtn.className = "vote-btn";
  voteBtn.textContent = "Vote";

  const voteCount = document.createElement("span");
  voteCount.className = "vote-count";
  voteCount.textContent = "0";

  voteBtn.addEventListener("click", () => {
    let count = parseInt(voteCount.textContent);
    voteCount.textContent = count + 1;
  });

  voteSection.appendChild(voteBtn);
  voteSection.appendChild(voteCount);

  li.appendChild(placeSpan);
  li.appendChild(voteSection);

  list.appendChild(li);
}
