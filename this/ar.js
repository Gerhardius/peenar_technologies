window.addEventListener('DOMContentLoaded', ()=>{
    const menu=document.getElementById('menu');
    const marker=document.querySelector('marker');
    const anchor=document.querySelector('#anchor');

    marker.addEventListener('markerFound', ()=>{
        menu.style.display ='block';
    })

    marker.addEventListener('markerLost', ()=>{
        menu.style.display ='none';
    })

    document.querySelectorAll('.pokemon-btn').forEach(btn =>{
        btn.addEventListener('click', ()=>{
            const imageSrc=btn.getAttribute('data-image');
            //neue emntity for pkm
            const entity=document.createElement('a-image');

            entity.setAttribute('src', imageSrc);
            entity.setAttribute('position', `${(Math.random() * 2 - 1).toFixed(2)} 0 ${(Math.random() * 2 - 1).toFixed(2)}`);
            entity.setAttribute('scale', '1 1 1');
            entity.setAttribute('rotation', '0 0 0'); 
            entity.setAttribute('look-at', '[camera]');
            
            let direction=1;
            const flipInterval=setInterval(()=>{
                direction *=-1;
                entity.setAttribute('scale', `${direction} 1 1`);
            }, 4000);

            entity.addEventListener('click', ()=>{
                clearInterval(flipInterval);
                anchor.removeChild(entity);
            });
            anchor.appendChild(entity);
        })
    })  
})
