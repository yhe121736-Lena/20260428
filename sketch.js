// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 第一步驟：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化攝影機擷取並設定比例
  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight);
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算顯示影像的寬度與高度 (整個畫布的 50%)
  // Calculate the width and height for displaying the video (50% of the canvas)
  let imgW = width * 0.5;
  let imgH = height * 0.5;
  
  // 計算影像放置的起始座標，使其位於正中間
  let offsetX = (width - imgW) / 2;
  let offsetY = (height - imgH) / 2;

  // 繪製攝影機影像
  // Draw the camera feed, centered and scaled
  image(video, offsetX, offsetY, imgW, imgH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          // 因為影像被移動到中間且縮小了，所以偵測點的座標也要跟著偏移與縮放
          // Since the image is centered and scaled, the detected keypoint coordinates also need to be offset and scaled.
          // 原始點 x * 0.5 (縮小) + 偏移量 (置中)
          let x = offsetX + (keypoint.x * 0.5);
          let y = offsetY + (keypoint.y * 0.5);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(x, y, 8); // 圓點也稍微縮小一點比較美觀
        }
      }
    }
  }
}

// 確保視窗縮放時，畫布與影像位置能自動修正
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
