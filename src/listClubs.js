export async function listClubs(jsonPath="/clubs.json"){
    try{
        let response=await fetch(jsonPath);
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let clubs=await response.json();
        let results=await Promise.all(
            clubs.map(async club=>{
                let [partOne, partTwo]=club.clubID.split(".");
                let basePath="img/";
                let clubPath=`${partOne}/${partTwo}/`;
                let fullImagePath=`${basePath}${clubPath}`;
                let images=[];
                try{
                    let imgRes=await fetch(`/images.json/${fullImagePath}`);
                    if (imgRes.ok){
                        images=await imgRes.json();
                    }
                    else{
                        console.warn(`Image list fetch failed for ${club.clubID}: ${imgRes.status}`);
                    }
                }
                catch (err){
                    console.warn(`No images found for ${club.clubID}:`, err.message);
                }
                return{
                    ...club, basePath, clubPath, fullImagePath, images
                };
            })
        );
        return results;
    }
    catch (error){
        console.error("Error loading clubs.json:", error);
        return [];
    }
}