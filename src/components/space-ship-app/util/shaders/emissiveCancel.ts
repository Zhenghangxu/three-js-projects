export const emissiveCancel = `
#ifdef USE_EMISSIVEMAP

vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);

emissiveColor *= 1.0 - smoothstep(- 0.02, 0.0, dot(geometryNormal, directionalLights[0].direction));

totalEmissiveRadiance *= emissiveColor.rgb;

#endif
`;

// credit: https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e