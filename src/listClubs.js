export async function listClubs(jsonPath="/clubs.json"){
    try{
        let response=await fetch(jsonPath);
        if (!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }
        let clubs=await response.json();
        const allImages=import.meta.glob("/src/assets/img/**/*.{png,jpg,jpeg,gif,webp}",{eager: true, import: "default"});
        let results=clubs.map(club =>{
            let [partOne, partTwo]=club.clubID.split(".");
            let folder=`${partOne}/${partTwo}/`;
            let images=[];
            for (const path in allImages){
                if (path.includes(`/img/${folder}`)){
                    images.push({
                        filename: path.split("/").pop(),
                        url: allImages[path]
                    });
                }
            }
            return{
                ...club,
                folder,
                images
            };
        });
        return results;
    }
    catch (err){
        console.error("Error loading clubs.json:", err);
        return [];
    }
}