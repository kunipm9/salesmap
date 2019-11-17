import React from "react";
import { MDBIcon } from "mdbreact";

/**
 *
 *
 * @param {*} props
 * @returns
 */
export const Rating = props => {
  console.assert(props.star, "star is undefined");

  const starp = [];
  let starIndex = props.star;
  while (starIndex >= 1) {
    starp.push(1);
    starIndex--;
  }
  let half = false;
  if (starIndex) {
    half = true;
  }

  /* global index */

  return (
    <ul className="rating">
      {
        <For each="s" index="index" of={starp}>
          <li key={index}>
            <MDBIcon icon="star" />
          </li>
        </For>
      }
      {
        <If condition={half}>
          <li>
            <MDBIcon far icon="star-half" />
          </li>
        </If>
      }
    </ul>
  );
};
