/**
 * Buscar dados da região
 * 
 * @param {string} region 
 * @returns {Object|Array}
 */
export function getDataRegion(region) {
  
  let dataRegion

  fetch(`/region?name=${region}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      
      dataRegion =  data
/*
      const setNarration = () => {
        const randomIdle = data.EventPhrase.filter(
          (events) => events.eventType === "no_item_found"
        );

        // Seleciona aleatoriamente um item dos resultados filtrados
        const randomIndex = Math.floor(Math.random() * randomIdle.length);
        const itemRandom = randomIdle[randomIndex];

        setNarration(itemRandom.text)
        
      };

      setNarration()
*/         
    })
    .catch((error) => {
      console.error("Error: ", error);
    });

    return dataRegion

}