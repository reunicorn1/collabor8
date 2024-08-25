import { project } from "./testData.js";

function transformData(input) {
  // transform each node
  function transformNode(node, type) {
    const transformed = {
      id: node._id,
      name: node.name || node.project_name, // use project_name for root project node
      type: type,
    };

    // Initialize children array if there are directories or files
    if (
      node.children &&
      (node.children.directories.length > 0 || node.children.files.length > 0)
    ) {
      transformed.children = [];

      // recursively transform directories
      node.children.directories.forEach((directory) => {
        transformed.children.push(transformNode(directory, "directory"));
      });

      // recursively transform files
      node.children.files.forEach((file) => {
        transformed.children.push(transformNode(file, "file"));
      });
    }

    return transformed;
  }

  // start from the root object
  return transformNode(input, "project");
}

export default transformData;
//console.log(JSON.stringify(transformedData, null, 2));
