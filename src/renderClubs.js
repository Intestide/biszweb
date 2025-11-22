import {listClubs} from "./listClubs.js";
/**
*Render club cards on the page for a given category.
*@param {string} pageName - "academic", "arts", "cs", "sports" 
*@param {string} containerSelector - selector for main container, default ".main-section"
 */
export async function renderClubs(pageName="", containerSelector=".main-section"){
    let clubData=await listClubs();
    let mainSection=document.querySelector(containerSelector);
    if (!mainSection){
        return console.warn("Container not found:", containerSelector);
    }
    mainSection.innerHTML="";
    let filteredClubs=clubData.filter(club=>club.clubID.split(".")[0]==pageName);
    if (filteredClubs.length==0){
        mainSection.innerHTML=`<p style="text-align: center; color: #666; font-size: 1.2rem;">No ${pageName.toUpperCase()} clubs found.</p>`;
        return;
    }
    filteredClubs.forEach((club, i)=>{
        let div=document.createElement("div");
        div.className="club-card";
        div.style.cssText=`
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        `;
        div.onmouseenter=()=>div.style.transform="translateY(-5px)";
        div.onmouseleave=()=>div.style.transform="translateY(0)";
        let imagesContainer=document.createElement("div");
        imagesContainer.className="club-images";
        imagesContainer.style.cssText=`
            display: flex;
            gap: 0.5rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        `;
        club.images.forEach(file=>{
            let img=new Image();
            img.src=`${club.fullImagePath}${file}`;
            img.loading="lazy";
            img.alt=`${club.clubName} image`;
            img.style.cssText=`
                max-width: 100px;
                max-height: 100px;
                object-fit: cover;
                border-radius: 4px;
            `;
            imagesContainer.appendChild(img);
        });
        div.innerHTML=`
            <h2 style="margin: 0 0 1rem 0; color: #333;">${club.clubName}</h2>
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