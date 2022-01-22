export let assets = {
  toLoad: 0,
  loaded: 0,
  load(sources) {
    return /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        const reportLoaded = () => {
          this.loaded += 1;
          if (this.toLoad === this.loaded) {
            this.toLoad = 0;
            this.loaded = 0;
            resolve();
          }
        };
        this.toLoad = sources.length;
        sources.forEach((source) => {
          const ext = source.split(".").pop();
          if (ext === "json") this.loadJson(source, reportLoaded);
          if (["ttf", "otf", "woff"].indexOf(ext) !== -1)
            this.loadFont(source, reportLoaded);
          // if (ext === "mp3") this.loadAudio(source, reportLoaded);
        });
      })
    );
  },

  loadFont(source, reportLoaded) {
    let fontFamily = source.split("/").pop().split(".")[0];

    let newStyle = document.createElement("style");
    let fontFace = `@font-face {font-family:'${fontFamily}'; src: url(${source});}`;
    newStyle.appendChild(document.createTextNode(fontFace));
    document.head.appendChild(newStyle);

    reportLoaded();
  },
  // loadAudio(source, reportLoaded) {
  //   let sound = makeSound(source, reportLoaded);
  //   sound.name = source;
  //   this[sound.name] = sound;
  // },
  async loadJson(source, reportLoaded) {
    const resp = await fetch(source);
    const jsonResponse = await resp.json();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let ref = /(?<=\/)\w+\.\w+$/.exec(source)[0];
    this[ref] = jsonResponse;

    if (jsonResponse.meta.frameTags) {
      this.processFrameTags(ref, jsonResponse, reportLoaded);
    } else if (jsonResponse.frames) {
      this.processFrames(jsonResponse, reportLoaded);
    } else {
      reportLoaded();
    }
  },

  processFrameTags(ref, jsonResponse, reportLoaded) {
    const filename = ref.split(".").shift();
    const imageSrc = jsonResponse.meta.image;
    const frameKeys = Object.keys(jsonResponse.frames);
    const imageLoadHandler = () => {
      this[imageSrc] = image;
      this[filename] = {
        image: this[imageSrc],
        frameTags: {},
        animationStates: {},
        animationFrames: [],
      };
      const extractFramesAndStates = () => {
        for (let frametag of jsonResponse.meta.frameTags) {
          let { name: frameTagName, from, to } = frametag;
          this[filename].animationStates[frameTagName] = [from, to];
        }
        frameKeys.forEach((frame) => {
          this[filename].animationFrames.push(jsonResponse.frames[frame]);
        });
      };
      const extractFrametags = () => {
        for (let frametag of jsonResponse.meta.frameTags) {
          let { name: frameTagName, from, to } = frametag,
            i = from + 0;
          if (!this[filename].frameTags?.[frameTagName])
            this[filename].frameTags[frameTagName] = [];
          do {
            this[filename].frameTags[frameTagName].push(
              jsonResponse.frames[frameKeys[i]]
            );
            i++;
          } while (i <= to);
        }
      };
      extractFramesAndStates();
      reportLoaded();
    };
    let image = new Image();
    image.addEventListener("load", imageLoadHandler);
    image.src = imageSrc;
  },
  processFrames(jsonResponse, reportLoaded) {
    const imageSrc = jsonResponse.meta.image;

    const imageLoadHandler = () => {
      this[imageSrc] = image;
      Object.keys(jsonResponse.frames).forEach((frame) => {
        this[frame] = jsonResponse.frames[frame];
        this[frame].source = this[imageSrc];
      });
      reportLoaded();
    };
    let image = new Image();
    image.addEventListener("load", imageLoadHandler);
    image.src = imageSrc;
  },
};
