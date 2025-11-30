import {renderClubs} from "../../src/renderClubs.js";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
let originalRenderClubs=renderClubs;
async function renderClubsWithAnimation(filterValue="", containerSelector=".club-body"){
    let clubBody=document.querySelector(containerSelector);
    clubBody.classList.add("loading-clubs");
    let existingCards=clubBody.querySelectorAll(".club-card");
    if (existingCards.length>0){
        await new Promise(resolve=>{
            gsap.to(existingCards,{
                scale: .5,
                opacity: 0,
                x: 0,
                y: 0,
                rotation: -10,
                duration: .5,
                stagger: .05,
                ease: "power3.in",
                transformOrigin: "50% 50%",
                onComplete: resolve
            });
        });
    }
    clubBody.innerHTML="";
    clubBody.classList.remove("loading-clubs");
    await originalRenderClubs(filterValue, containerSelector);
    let newCards=clubBody.querySelectorAll(".club-card");
    if (newCards.length>0){
        newCards.forEach(card=>{
            gsap.set(card,{
                y: 50,
                opacity: 0,
                scale: .95
            });
            gsap.to(card,{
                y: 0,
                opacity: 1,
                scale: 1,
                duration: .8,
                ease: "power2.out",
                scrollTrigger:{
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play reverse play reverse", 
                }
            });
        });
    }
    let searchInput=document.getElementById("clubs-search-bar");
    let searchTerm=searchInput.value.toLowerCase().trim();
    if (searchTerm){
        highlightSearchTerms(searchTerm);
    }
}
function handleSearch(){
    let searchInput=document.getElementById("clubs-search-bar");
    searchInput.addEventListener("input", function(e){
        let searchTerm=e.target.value.toLowerCase().trim();
        filterClubsBySearch(searchTerm);
        highlightSearchTerms(searchTerm);
    });
}
function filterClubsBySearch(searchTerm){
    let clubCards=document.querySelectorAll(".club-card");
    if (searchTerm==""){
        clubCards.forEach(card=>{
            card.style.display="block";
            removeHighlights(card);
        });
        return;
    }
    clubCards.forEach(card=>{
        let cardText=card.textContent.toLowerCase()||card.innerText.toLowerCase();
        if (cardText.includes(searchTerm)){
            card.style.display="block";
        }
        else{
            card.style.display="none";
            removeHighlights(card);
        }
    });
}
function highlightSearchTerms(searchTerm){
    removeAllHighlights();
    if (!searchTerm){
        return;
    }
    let clubCards=document.querySelectorAll(".club-card");
    let searchWords=searchTerm.split(/\s+/).filter(word=>word.length>0);
    clubCards.forEach(card=>{
        if (card.style.display!="none"){
            highlightCardText(card, searchWords);
        }
    });
}
function highlightCardText(card, searchWords){
    let tempDiv=document.createElement("div");
    tempDiv.innerHTML=card.innerHTML;
    function highlightElement(element){
        let children=element.childNodes;
        for (let i=0; i<children.length; i++){
            let child=children[i];
            if (child.nodeType==Node.TEXT_NODE){
                let text=child.textContent;
                let newHTML=text;
                searchWords.forEach(word=>{
                    let regex=new RegExp(`(${escapeRegExp(word)})`, "gi");
                    newHTML=newHTML.replace(regex, "<mark class=\"search-highlight\">$1</mark>");
                });
                if (newHTML!=text){
                    let span=document.createElement("span");
                    span.innerHTML=newHTML;
                    element.replaceChild(span, child);
                    i+=span.childNodes.length-1;
                }
            }
            else if (child.nodeType==Node.ELEMENT_NODE&&child.tagName!="MARK"&&!child.classList.contains("search-highlight")){
                highlightElement(child);
            }
        }
    }
    highlightElement(tempDiv);
    card.innerHTML=tempDiv.innerHTML;
}
function removeHighlights(element){
    let highlights=element.querySelectorAll("mark.search-highlight");
    highlights.forEach(highlight=>{
        let parent=highlight.parentNode;
        if (parent){
            let text=document.createTextNode(highlight.textContent);
            parent.replaceChild(text, highlight);
            if (parent.nodeType==Node.ELEMENT_NODE){
                parent.normalize();
            }
        }
    });
}
function removeAllHighlights(){
    let highlights=document.querySelectorAll("mark.search-highlight");
    highlights.forEach(highlight=>{
        let parent=highlight.parentNode;
        if (parent){
            let text=document.createTextNode(highlight.textContent);
            parent.replaceChild(text, highlight);
        }
    });
    let clubCards=document.querySelectorAll(".club-card");
    clubCards.forEach(card=>{
        card.normalize();
    });
}
function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function applyCombinedFilters(){
    let searchInput=document.getElementById("clubs-search-bar");
    let searchTerm=searchInput.value.toLowerCase().trim();
    let activeCheckbox=document.querySelector(".club-type-checkbox:checked");
    let typeFilterValue="";
    if (activeCheckbox){
        let categoryMap={
            "Academic/Intellectual": "academic",
            "Arts/Performance": "arts", 
            "CS/ICT/Technology": "cs",
            "Sports/Wellness": "sports"
        };
        typeFilterValue=categoryMap[activeCheckbox.value]||"";
    }
    renderClubsWithAnimation(typeFilterValue).then(()=>{
        if (searchTerm){
            filterClubsBySearch(searchTerm);
            highlightSearchTerms(searchTerm);
        }
    });
}
function enhancedFilterClubsBySearch(searchTerm){
    let clubCards=document.querySelectorAll(".club-card");
    let visibleCards=Array.from(clubCards).filter(card=>{
        let computedStyle=window.getComputedStyle(card);
        return computedStyle.display!="none"&&computedStyle.visibility!="hidden"&&computedStyle.opacity!="0";
    });
    if (searchTerm==""){
        visibleCards.forEach(card=>{
            gsap.to(card,{
                opacity: 1,
                scale: 1,
                duration: .3,
                ease: "power2.out"
            });
            removeHighlights(card);
        });
        return;
    }
    visibleCards.forEach(card=>{
        let cardText=card.textContent.toLowerCase()||card.innerText.toLowerCase();
        if (cardText.includes(searchTerm)){
            gsap.to(card,{
                opacity: 1,
                scale: 1,
                duration: .3,
                ease: "power2.out"
            });
        }
        else{
            gsap.to(card,{
                opacity: 0,
                scale: .8,
                duration: .3,
                ease: "power2.in",
                onComplete: ()=>{
                    card.style.display="none";
                    removeHighlights(card);
                }
            });
        }
    });
    highlightSearchTerms(searchTerm);
}
document.addEventListener("DOMContentLoaded", function(){
    renderClubsWithAnimation("");
    let checkboxes=document.querySelectorAll(".club-type-checkbox");
    checkboxes.forEach(checkbox=>{
        checkbox.addEventListener("change", handleClubTypeFilter);
    });
    handleSearch();
    let searchInput=document.getElementById("clubs-search-bar");
    searchInput.addEventListener("input", applyCombinedFilters);
    animatePageLoad();
});
function handleClubTypeFilter(event){
    let clickedCheckbox=event.target;
    let allCheckboxes=document.querySelectorAll(".club-type-checkbox");
    allCheckboxes.forEach(checkbox=>{
        if (checkbox!=clickedCheckbox){
            checkbox.checked=false;
        }
    });
    let filterValue="";
    if (clickedCheckbox.checked){
        let categoryMap={
            "Academic/Intellectual": "academic",
            "Arts/Performance": "arts", 
            "CS/ICT/Technology": "cs",
            "Sports/Wellness": "sports"
        };
        filterValue=categoryMap[clickedCheckbox.value]||"";
    }
    applyCombinedFilters();
}
function animatePageLoad(){
    let headerDivs=document.querySelectorAll(".header div");
    gsap.from(headerDivs,{
        y: -40,
        opacity: 0,
        duration: .9,
        stagger: .3,
        ease: "power2.out"
    });
    let filters=document.querySelector(".filters");
    gsap.from(filters,{
        y: 30,
        opacity: 0,
        duration: .7,
        delay: .4,
        ease: "power2.out"
    });
    let clubTypeLabels=document.querySelectorAll("span.club-type-label");
    gsap.set(clubTypeLabels,{
        opacity: 1,
        y: 0
    });
    gsap.from(clubTypeLabels,{
        y: 20,
        opacity: 0,
        duration: .6,
        stagger: .15,
        delay: .8,
        ease: "power2.out"
    });
    clubTypeLabels.forEach(label=>{
        label.addEventListener("mouseenter", function(){
            gsap.to(this,{
                scale: 1.08,
                duration: .25,
                ease: "power2.out"
            });
        });
        label.addEventListener("mouseleave", function(){
            gsap.to(this,{
                scale: 1,
                duration: .25,
                ease: "power2.out"
            });
        });
        label.addEventListener("click", function(){
            gsap.to(this,{
                scale: .92,
                duration: .15,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    });
    let searchInput=document.getElementById("clubs-search-bar");
    gsap.from(searchInput,{
        y: 20,
        opacity: 1,
        duration: .6,
        delay: 1.0,
        ease: "power2.out"
    });
}
document.addEventListener("keydown", function(e){
    if ((e.ctrlKey&&e.key=="k")||e.key=="/"){
        e.preventDefault();
        let searchInput=document.getElementById("clubs-search-bar");
        searchInput.focus();
        searchInput.select();
    }
    if (e.key=="Escape"){
        let searchInput=document.getElementById("clubs-search-bar");
        if (document.activeElement==searchInput){
            searchInput.value="";
            applyCombinedFilters();
            removeAllHighlights();
            searchInput.blur();
        }
    }
});
window.renderClubs=renderClubsWithAnimation;
