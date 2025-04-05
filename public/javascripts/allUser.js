let container = document.querySelector(".container");
let input = document.querySelector("#input");
let menu = document.querySelector(".menu");
let close = document.querySelector(".close");
let sidemenus = document.querySelector(".sidemenus");
menu.addEventListener("click", () => {
  sidemenus.style.right = "0%";
});
close.addEventListener("click", () => {
  sidemenus.style.right = "-100%";
});
let getAllUsers = async () => {
  try {
    let response = await fetch("http://localhost:4000/admin/all-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch users:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

getAllUsers()
  .then((data) => {
    let arr = data;
    let alluser = (elem) => {
      container.innerHTML = ""; // Clear the container before appending new content
      elem.forEach((user) => {
        let template = `<div class="card">
          <div class="img">
          <img src="${user.profilepic}" alt="" />
          </div>
              <h1>${user.name}</h1>
              <h4>${user.email}</h4>
              <form action="/admin/block/${user.id}" method="post">
              <button type="submit" >Block</button>
              </form>
          </div>`;
        container.innerHTML += template;
      });
    };
    alluser(arr);
    input.addEventListener("input", (e) => {
      let filterData = arr.filter((user) => {
        return user.name.toLowerCase().includes(e.target.value.toLowerCase()) || user.email.toLowerCase().includes(e.target.value.toLowerCase());
      });
      alluser(filterData);
    });
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
  });
