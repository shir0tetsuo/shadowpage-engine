// Useful test code / things for later

/*
function calculateOppositeColor(hexColor) {
  // Remove the "#" symbol from the hexColor string, if present
  hexColor = hexColor.replace("#", "");

  // Convert the hex color to RGB components
  const R = parseInt(hexColor.substr(0, 2), 16);
  const G = parseInt(hexColor.substr(2, 2), 16);
  const B = parseInt(hexColor.substr(4, 2), 16);

  // Calculate the opposite color's RGB components
  const oppositeR = 255 - R;
  const oppositeG = 255 - G;
  const oppositeB = 255 - B;

  // Convert the opposite RGB components back to hexadecimal format
  const oppositeHexColor =
    "#" +
    ((1 << 24) + (oppositeR << 16) + (oppositeG << 8) + oppositeB)
      .toString(16)
      .slice(1);

  return oppositeHexColor;
}

function splitUUID(uuid) {
  // Step 1: Remove the '-' characters
  const cleanedUUID = uuid.replace(/-/g, '');

  // Step 2: Split the cleaned UUID into an array of smaller strings, each 6 characters long
  const result = [];
  for (let i = 0; i < cleanedUUID.length; i += 6) {
    result.push(cleanedUUID.substr(i, 6));
  }

  return result;
}

function Rainbowify(uuid) {
  const splintered_uuid = splitUUID(uuid)

  var RainbowTag = '<span class="rainbowcontainer">'

  for (let i = 0; i < Math.min(5, splintered_uuid.length); i++) {
    const currentString = splintered_uuid[i];
    const oppositeHex = calculateOppositeColor(`#${currentString}`)
    RainbowTag += `<span style="background-color: #${currentString}; color: ${oppositeHex};">${currentString}</span>`
  }

  RainbowTag += '<span style="background-color: #1F1F1F; color: #FFF;">'+(splintered_uuid[5])+'</span></span>'

  return RainbowTag
  
}
*/
