'use strict';

//this component will basically just toggle off/on the spinning of the walls
AFRAME.registerComponent('win-state', {
  schema: {
    duration: {type: 'number', default:20000.0},  //duration is in milliseconds
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;
    Context_AF.scene      = document.querySelector('a-scene');
    Context_AF.winState = document.createElement('a-entity');
    Context_AF.clicked = false;
    
    Context_AF.winState.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 2
    });
    Context_AF.winState.setAttribute('material', {
      color: 'yellow'
    });
    
    //let's add the basic animation to teh walls entity
    //note that it is not enabled initially
    //Context_AF.walls.setAttribute('animation', {property:'rotation.y', to:360, loop:true, dur:Context_AF.data.duration, easing:'linear', enabled:false});
    
    //listen on click
    Context_AF.el.addEventListener('click', function() {
      Context_AF.winState.setAttribute('position', {
        x: this.getAttribute('position').x,
        y: this.getAttribute('position').y + 5,
        z: this.getAttribute('position').z
      });
      if(!Context_AF.clicked){
        Context_AF.scene.appendChild(Context_AF.winState);
        Context_AF.clicked = true;
      }
      
    });
  },
  
  //component documentation: https://github.com/aframevr/aframe/blob/master/docs/core/component.md
  
  // update: function (oldData) {},
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
