import * as React from "react";

export default (props: { width?: number, height?: number, className?: string }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="100px"
    y="100px"
    viewBox="0 0 296.563 296.563"
    width={props.width || 100}
    height={props.height || 100}
    className={props.className}
  >
    <g>
      <g>
        <g>
          <path
            d="M148.282,0C66.52,0,0,66.519,0,148.282s66.52,148.281,148.282,148.281s148.281-66.519,148.281-148.281
				S230.045,0,148.282,0z M148.282,286.563C72.033,286.563,10,224.531,10,148.282S72.033,10,148.282,10
				s138.281,62.032,138.281,138.281S224.531,286.563,148.282,286.563z"
          />
          <path
            d="M168.672,255.486c-6.676,1.261-13.535,1.9-20.39,1.9c-2.762,0-5,2.238-5,5c0,2.762,2.238,5,5,5
				c7.476,0,14.96-0.698,22.245-2.074c2.714-0.513,4.498-3.128,3.985-5.841C174,256.757,171.385,254.971,168.672,255.486z"
          />
          <path
            d="M252.505,195.068c-2.468-1.243-5.473-0.249-6.715,2.217c-11.035,21.915-29.36,39.673-51.601,50.003
				c-2.504,1.164-3.592,4.137-2.429,6.642c1.167,2.509,4.142,3.589,6.642,2.429c24.274-11.276,44.275-30.658,56.319-54.575
				C255.964,199.316,254.971,196.31,252.505,195.068z"
          />
          <path
            d="M153.282,34.177c0-2.762-2.238-5-5-5c-53.241,0-100.418,35.773-114.725,86.994c-0.743,2.659,
            0.811,5.418,3.471,6.16c2.64,0.74,5.413-0.796,6.16-3.471C56.293,71.945,99.51,39.177,148.282,39.177C151.044,
            39.177,153.282,36.939,153.282,34.177z"
          />
          <path
            d="M209.836,148.282c0-33.94-27.613-61.554-61.554-61.554c-33.94,0-61.554,27.613-61.554,61.554
				s27.613,61.554,61.554,61.554C182.223,209.835,209.836,182.222,209.836,148.282z M96.729,148.282
				c0-28.427,23.127-51.554,51.554-51.554s51.554,23.127,51.554,51.554s-23.127,51.554-51.554,51.554
				C119.855,199.835,96.729,176.708,96.729,148.282z"
          />
          <path
            d="M184.047,148.282c0-19.721-16.044-35.765-35.765-35.765c-19.722,0-35.766,16.044-35.766,35.765
				s16.044,35.765,35.766,35.765C168.003,184.046,184.047,168.002,184.047,148.282z M148.283,174.047
				c-14.208-0.001-25.766-11.558-25.766-25.765c0-14.207,11.559-25.765,25.766-25.765c14.207,0,25.765,11.558,25.765,25.765
				C174.048,162.489,162.49,174.047,148.283,174.047z"
          />
        </g>
      </g>
    </g>
  </svg>
);
