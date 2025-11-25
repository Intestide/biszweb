import {defineConfig} from "vite";
import fs from "fs";
import path from "path";
export default defineConfig({
    plugins:[
        {
            name: "preload-ttf-fonts",
            transformIndexHtml(){
                let fontsDir=path.resolve(__dirname, "public/fonts");
                let preloadTags=[];
                if (fs.existsSync(fontsDir)){
                    let files=fs.readdirSync(fontsDir);
                    let targetFonts=["EBGaramond-VariableFont_wght.ttf", "NotoSansSC-VariableFont_wght.ttf"];
                    targetFonts.forEach(font=>{
                        if (files.includes(font)){
                            preloadTags.push({
                                tag: "link",
                                attrs: {
                                    rel: "preload",
                                    as: "font",
                                    href: `/fonts/${font}`,
                                    type: "font/ttf",
                                    crossorigin: ""
                                },
                                injectTo: "head"
                            });
                        }
                    });
                }
                return{
                    tags: preloadTags
                };
            }
        }
    ]
});