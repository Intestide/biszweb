import 'lenis/dist/lenis.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin) 

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

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
    let angle = Math.atan(window.innerHeight/window.innerWidth);
    // console.log(angle*(180/Math.PI));
    gsap.set(".band",{rotate: angle*(180/Math.PI)});
    let bandWidth = document.querySelector(".band").scrollWidth;
    const p2tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".p2",
        start: "top top",
        end: () => "+=" + bandWidth,
        pin: true,
        scrub: true
      }
    });
    p2tl.to(".band", {x:-bandWidth*Math.cos(angle),y:-bandWidth*Math.sin(angle), ease: "none"});
    p2tl.to(".p2Bg", {
      onUpdate: function() {
        let color1 = gsap.utils.interpolate("hsla(0, 100%, 50%, 1.00)","hsla(180, 100%, 50%, 1.00)", this.progress());
        let color2 = gsap.utils.interpolate("hsla(180, 100%, 50%, 1.00)", "hsla(360, 100%, 50%, 1.00)", this.progress());
        let gradient = `linear-gradient(to right, ${color1}, ${color2})`;
        document.querySelector(".p2Bg").style.backgroundImage = gradient;
      }
    }, 0);


}
document.querySelector("#scrollBtn").addEventListener('click', scrollDown);
function scrollDown(){
  gsap.to(window,{duration:0.2,behavior: 'smooth', scrollTo: window.innerHeight});
}
