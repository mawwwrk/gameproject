export function makePointer(element, scale = 1) {
  let pointer = {
    element: element,
    scale: scale,

    //Private x and y properties
    _x: 0,
    _y: 0,

    //The public x and y properties are divided by the scale. If the
    //HTML element that the pointer is sensitive to (like the canvas)
    //is scaled up or down, you can change the `scale` value to
    //correct the pointer's position values
    get x() {
      return this._x / this.scale;
    },
    get y() {
      return this._y / this.scale;
    },

    //Add `centerX` and `centerY` getters so that we
    //can use the pointer's coordinates with easing
    //and collision functions
    get centerX() {
      return this.x;
    },
    get centerY() {
      return this.y;
    },

    //`position` returns an object with x and y properties that
    //contain the pointer's position
    get position() {
      return { x: this.x, y: this.y };
    },

    //Booleans to track the pointer state
    isDown: false,
    isUp: true,
    tapped: false,

    //Properties to help measure the time between up and down states
    downTime: 0,
    elapsedTime: 0,

    //Optional, user-definable `press`, `release`, and `tap` methods
    press: undefined,
    release: undefined,
    tap: undefined,

    //The pointer's mouse `moveHandler`
    moveHandler(event) {
      //Get the element that's firing the event
      let element = event.target;

      //Find the pointer’s x,y position (for mouse).
      //Subtract the element's top and left offset from the browser window
      this._x = event.pageX - element.offsetLeft;
      this._y = event.pageY - element.offsetTop;

      //Prevent the event's default behavior
      event.preventDefault();
    },

    //The pointer's `touchmoveHandler`
    touchmoveHandler(event) {
      let element = event.target;

      //Find the touch point's x,y position
      this._x = event.targetTouches[0].pageX - element.offsetLeft;
      this._y = event.targetTouches[0].pageY - element.offsetTop;
      event.preventDefault();
    },

    //The pointer's `downHandler`
    downHandler(event) {
      //Set the down states
      this.isDown = true;
      this.isUp = false;
      this.tapped = false;

      //Capture the current time
      this.downTime = Date.now();

      //Call the `press` method if it's been assigned by the user
      if (this.press) this.press(event);
      event.preventDefault();
    },

    //The pointer's `touchstartHandler`
    touchstartHandler(event) {
      let element = event.target;

      //Find the touch point's x,y position
      this._x = event.targetTouches[0].pageX - element.offsetLeft;
      this._y = event.targetTouches[0].pageY - element.offsetTop;

      //Set the down states
      this.isDown = true;
      this.isUp = false;
      this.tapped = false;

      //Capture the current time
      this.downTime = Date.now();

      //Call the `press` method if it's been assigned by the user
      if (this.press) this.press();
      event.preventDefault();
    },

    //The pointer's `upHandler`
    upHandler(event) {
      //Figure out how much time the pointer has been down
      this.elapsedTime = Math.abs(this.downTime - Date.now());

      //If it's less than 200 milliseconds, it must be a tap or click
      if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;

        //Call the `tap` method if it's been assigned
        if (this.tap) this.tap();
      }
      this.isUp = true;
      this.isDown = false;

      //Call the `release` method if it's been assigned by the user
      if (this.release) this.release();
      event.preventDefault();
    },

    //The pointer's `touchendHandler`
    touchendHandler(event) {
      //Figure out how much time the pointer has been down
      this.elapsedTime = Math.abs(this.downTime - Date.now());

      //If it's less than 200 milliseconds, it must be a tap or click
      if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;

        //Call the `tap` method if it's been assigned by the user
        if (this.tap) this.tap();
      }
      this.isUp = true;
      this.isDown = false;

      //Call the `release` method if it's been assigned by the user
      if (this.release) this.release();
      event.preventDefault();
    },
  };
  //Bind the events to the handlers’
  //Mouse events
  element.addEventListener(
    "mousemove",
    pointer.moveHandler.bind(pointer),
    false
  );
  element.addEventListener(
    "mousedown",
    pointer.downHandler.bind(pointer),
    false
  );

  //Add the `mouseup` event to the `window` to
  //catch a mouse button release outside of the canvas area
  window.addEventListener("mouseup", pointer.upHandler.bind(pointer), false);

  //Touch events

  element.addEventListener(
    "touchmove",
    pointer.touchmoveHandler.bind(pointer),
    false
  );
  element.addEventListener(
    "touchstart",
    pointer.touchstartHandler.bind(pointer),
    false
  );

  //Add the `touchend` event to the `window` object to
  //catch a mouse button release outside the canvas area
  window.addEventListener(
    "touchend",
    pointer.touchendHandler.bind(pointer),
    false
  );

  //Disable the default pan and zoom actions on the `canvas`
  element.style.touchAction = "none";

  //Return the pointer
  return pointer;
}
