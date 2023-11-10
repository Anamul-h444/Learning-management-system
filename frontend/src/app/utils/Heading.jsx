import React from "react";

const Heading = ({ description, keywords, title }) => {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <title>{title}</title>
    </div>
  );
};

export default Heading;
