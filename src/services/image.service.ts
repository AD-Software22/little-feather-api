export function getResizedImageUrls(originalUrl: string): string[] {
  const allUrls: string[] = [originalUrl]

  const imageSizes = [
    { width: 100, height: 100 },
    { width: 160, height: 90 },
    { width: 350, height: 200 },
  ]

  for (const size of imageSizes) {
    const pathAndRest = originalUrl.split('%2F')
    const idAndRest = pathAndRest.pop()!.split('?')
    const id = idAndRest[0]
    const path = pathAndRest.join('%2F')
    const rest = idAndRest.slice(1).join('?')
    const resizedUrl =
      path +
      '%2Fresized%2F' +
      id +
      '_' +
      size.width +
      'x' +
      size.height +
      '?' +
      rest

    allUrls.push(resizedUrl)
  }

  return allUrls
}
