import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function(event){
  gsap.to(".loader",{duration:1.5,opacity:0,ease:"slow(0.7,0.7,false)",onComplete:function(){
    document.querySelector(".loader").style.display="none";
  }});
  gsap.to(".main",{duration:0.5,opacity:1,ease:"power2.out",delay:1.5,onStart: function(){
    document.querySelector(".main").style.display="block";
    animate();
  }});
});
const animate = () => {
    gsap.from(".title",{duration:1,scale:0.9,opacity:0,ease:"power2.out",delay:0.5});
    gsap.from(".subtitle",{duration:1,x:"-60%",opacity:0,ease:"bounce",delay:1});
    document.getElementById("scrollBtn").addEventListener("click",scrollDown);
    let bandWidth = document.querySelector(".band").scrollWidth;
    const p2Tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".p2",
        start: "top top",
        end: () => "+=" + bandWidth,
        pin: true,
        scrub: true
      }
    });
    // p2Tl.to(".c", {
    //   // x: -(this.document.querySelector(".band").scrollWidth + window.innerWidth + 20),
    //   x: -bandWidth,
    // });
    p2Tl.fromTo(".band", {x:window.innerWidth}, {x:-bandWidth});
    // p2Tl.to(".p2Bg", {rotate: 720, duration:1});
}

function scrollDown(){
  gsap.scrollTo(window.innerHeight, {duration:4,behavior: 'smooth'});
}
