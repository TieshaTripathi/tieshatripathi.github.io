import { Children, cloneElement, isValidElement } from "react";

function words(children) {
  return Children.map(children, (child) => {
    if (typeof child === "string")
      return child.split(/(\s+)/).map((part, i) =>
        /\s/.test(part) ? (
          part
        ) : (
          <span className="word-clip" key={i}>
            <span className="type-word">{part}</span>
          </span>
        ),
      );
    if (isValidElement(child) && child.props.children)
      return cloneElement(child, {}, words(child.props.children));
    return child;
  });
}

/** Word masks keep the original reading order and explicit line breaks. */
export default function Heading({ children, ...props }) {
  return <h2 {...props}>{words(children)}</h2>;
}
