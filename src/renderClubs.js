import {listClubs} from "./listClubs.js";
/**
*Render club cards on the page for a given category.
*@param {string} pageName - "academic", "arts", "cs", "sports" 
*@param {string} containerSelector - selector for main container, default ".main-section"
 */
export async function renderClubs(pageName="", containerSelector=".club-body"){
    let clubData=await listClubs();
    let mainSection=document.querySelector(containerSelector);
    if (!mainSection){
        return console.warn("Container not found:", containerSelector);
    }
    mainSection.innerHTML="";
    let filteredClubs=(pageName==""||pageName=="all")?clubData:clubData.filter(club=>club.clubID.split(".")[0]==pageName);
    if (filteredClubs.length==0){
        mainSection.innerHTML=`<p class="no-clubs-message">No ${pageName.toUpperCase()} clubs found.</p>`;
        return;
    }
    filteredClubs.forEach((club, i)=>{
        let div=document.createElement("div");
        div.className="club-card js-club-card";
        let imagesContainer=document.createElement("div");
        imagesContainer.className="club-images";
        club.images.forEach(imgObj=>{
            let img=new Image();
            img.src=imgObj.url;
            img.loading="lazy";
            img.alt=`${club.clubName} image`;
            img.className="club-image";
            imagesContainer.appendChild(img);
        });
        let clubCategory=club.clubID.split(".")[0];
        switch (clubCategory){
            case "academic":
                clubCategory="Academic/Intellectual";
                break;
            case "arts":
                clubCategory="Arts/Performance";
                break;
            case "cs":
                clubCategory="Computer Science/Information and Communication Technology/Technology"
                break;
            case "sports":
                clubCategory="Sports/Wellness";
                break;
            default:
                break;
        }
        div.innerHTML=`
            <h2 class="club-card-title">${club.clubName}</h2>
            <p><strong>Club Category:</strong> ${clubCategory}</p>
            <p><strong>Advisor:</strong> ${club.clubAdvisor}</p>
            <p><strong>Student Leaders:</strong> ${club.clubStudentLeader}</p>
            <p><strong>Grades:</strong> ${club.grades}</p>
            <p><strong>Time:</strong> ${club.time}</p>
            <p><strong>Cost:</strong> ${club.cost}</p>
            <p><strong>Description:</strong> ${club.description}</p>
        `;
        div.appendChild(imagesContainer);
        mainSection.appendChild(div);
        setTimeout(()=>{
            div.style.opacity="0";
            div.style.transition="opacity 0.5s ease";
            mainSection.appendChild(div);
            setTimeout(()=>div.style.opacity="1", 50);
        }, 100*i);
    });
}