function getTimeString(time){
    const day = parseInt(time / 86500);
    let remainSecond = time % 86500;
    const hour = parseInt(remainSecond / 3600);
    remainSecond = time % 3600;
    const minite = parseInt(remainSecond / 60);
    remainSecond = remainSecond % 60;
    return `${hour} hour ${minite} minite ${remainSecond} second`
}

function removeActiveClass(){
    const buttons = document.getElementsByClassName('category_btn');
    for(let btn of buttons){
        btn.classList.remove("active")
    }
}

function loadCategoriesVideo(id){
//    alert(id) ;
   fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        // sobgulo theke active class remove koro
        removeActiveClass();

        // click korle active class add koro
        const activeButton = document.getElementById(`btn-${id}`);
        activeButton.classList.add("active");
        displayVideos(data.category)
    })
    .catch((error) => console.log(error));
}

const loadDetails =async (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.video)
}

const displayDetails = (video) =>{
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML = `
    <img src = " ${video.thumbnail}"/>
    <p>${video.description}</p>
    `
    document.getElementById("customModal").showModal();
}


// create loadcategories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};



// create loadVideos
const loadVideos = (searchText = "") => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};



// created displaycategories
const displayCategories = (categories) => {
  const categorieContainer = document.getElementById("categories");
  categories.forEach((item) => {
    // console.log(item);

    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
       <button id ="btn-${item.category_id}" onclick="loadCategoriesVideo(${item.category_id})" class="btn category_btn">
       ${item.category}
       </button>
    `

    categorieContainer.appendChild(buttonContainer);
  });
};



// create displayvideos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = " "

  if(videos.length == 0){
    videoContainer.classList.remove('grid')
    videoContainer.innerHTML = `
    <div class ="min-h-[300px] flex flex-col gap-5 justify-center items-center">
       <img src="assets/Icon.png"/>
       <h2 class ="font-bold text-4xl">NO CONTENT HERE</h2>
    </div>
    `;
    return;
  }else{
    videoContainer.classList.add('grid')
  }
  videos.forEach((video) => {
    // console.log(video);

    const card = document.createElement("div");
    card.classList = "card card-compact"
    card.innerHTML = `

        <figure class ="h-[200px] relative">
           <img
              src=${video.thumbnail}
              class ="h-full w-full object-cover rounded-lg"
              alt="N/A" />
              ${video.others.posted_date?.length === 0? " " : `<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white" text-xs>${getTimeString(video.others.posted_date)}</span>`}
            
        </figure>
        <div class="px-0 py-2 flex gap-2">

        <div>
           <img class="w-10 h-10 rounded-full" src="${video.authors[0].profile_picture}" />
        </div>
        <div>
          <h2 class="font-bold">${video.title}</h2>
          <div class="flex gap-2 items-center">
             <p> ${video.authors[0].profile_name}</p>
             ${video.authors[0].verified === true? `<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png">` : "" }
          </div>
          <p> <button onclick = "loadDetails('${video.video_id}')" class ="btn btn-sm btn-error">Details</button> </p>
        </div>
           
        </div>

        `;
    videoContainer.append(card);
  });
};

document.getElementById('search-input').addEventListener("keyup", (e) =>{
    loadVideos(e.target.value)
})
loadCategories();
loadVideos();
