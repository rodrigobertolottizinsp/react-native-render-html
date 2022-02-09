import React from 'react';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {_constructStyles, _getElementClassStyles} from './HTMLStyles';
import HTMLImage from './HTMLImage';

export function a(htmlAttribs, children, convertedCSSStyles, passProps) {
  const style = _constructStyles({
    tagName: 'a',
    htmlAttribs,
    passProps,
    styleSet: passProps.parentWrapper === 'Text' ? 'TEXT' : 'VIEW',
  });
  // !! This deconstruction needs to happen after the styles construction since
  // the passed props might be altered by it !!
  const {parentWrapper, onLinkPress, key, data} = passProps;
  const onPress = (evt) =>
    onLinkPress && htmlAttribs && htmlAttribs.href
      ? onLinkPress(evt, htmlAttribs.href, htmlAttribs)
      : undefined;

  if (parentWrapper === 'Text') {
    return (
      <Text {...passProps} style={style} onPress={onPress} key={key}>
        {children || data}
      </Text>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} key={key}>
        {children || data}
      </TouchableOpacity>
    );
  }
}

export function img(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
  if (!htmlAttribs.src) {
    return false;
  }

  const style = _constructStyles({
    tagName: 'img',
    htmlAttribs,
    passProps,
    styleSet: 'IMAGE',
  });
  const {src, alt, width, height} = htmlAttribs;
  return (
    <HTMLImage
      source={{uri: src}}
      alt={alt}
      width={width}
      height={height}
      style={style}
      {...passProps}
    />
  );
}

export function ul(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
  const style = _constructStyles({
    tagName: 'ul',
    htmlAttribs,
    passProps,
    styleSet: 'VIEW',
  });
  const {
    allowFontScaling,
    textSelectable,
    rawChildren,
    nodeIndex,
    key,
    baseFontStyle,
    listsPrefixesRenderers,
  } = passProps;
  const baseFontSize = baseFontStyle.fontSize || 14;

  children =
    children &&
    children.map((child, index) => {
      const rawChild = rawChildren[index];
      let prefix = false;
      const rendererArgs = [
        htmlAttribs,
        children,
        convertedCSSStyles,
        {
          ...passProps,
          index,
        },
      ];

      if (rawChild) {
        if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
          prefix =
            listsPrefixesRenderers && listsPrefixesRenderers.ul ? (
              listsPrefixesRenderers.ul(...rendererArgs)
            ) : (
              <View
                style={{
                  marginRight: 10,
                  width: baseFontSize / 2.8,
                  height: baseFontSize / 2.8,
                  marginTop: baseFontSize / 2,
                  borderRadius: baseFontSize / 2.8,
                  backgroundColor: 'black',
                }}
              />
            );
        } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
          prefix =
            listsPrefixesRenderers && listsPrefixesRenderers.ol ? (
              listsPrefixesRenderers.ol(...rendererArgs)
            ) : (
              <Text
                allowFontScaling={allowFontScaling}
                selectable={textSelectable}
                style={{
                  marginRight: 5,
                  color: baseFontStyle.color,
                  fontSize: baseFontSize,
                }}>
                {index + 1})
              </Text>
            );
        }
      }
      return (
        <View
          key={`list-${nodeIndex}-${index}-${key}`}
          style={{flexDirection: 'row', marginBottom: 2, marginTop: 2}}>
          {prefix}
          <View style={{flex: 1}}>{child}</View>
        </View>
      );
    });
  return (
    <View style={style} key={key}>
      {children}
    </View>
  );
}
export const ol = ul;

export function iframe(htmlAttribs, children, convertedCSSStyles, passProps) {
  const {staticContentMaxWidth, tagsStyles, classesStyles} = passProps;

  const tagStyleHeight = tagsStyles.iframe && tagsStyles.iframe.height;
  const tagStyleWidth = tagsStyles.iframe && tagsStyles.iframe.width;

  const classStyles = _getElementClassStyles(htmlAttribs, classesStyles);
  const classStyleWidth = classStyles.width;
  const classStyleHeight = classStyles.height;

  const attrHeight = htmlAttribs.height ? parseInt(htmlAttribs.height) : false;
  const attrWidth = htmlAttribs.width ? parseInt(htmlAttribs.width) : false;

  const height = attrHeight || classStyleHeight || tagStyleHeight || 200;
  const width =
    attrWidth || classStyleWidth || tagStyleWidth || staticContentMaxWidth;

  const style = _constructStyles({
    tagName: 'iframe',
    htmlAttribs,
    passProps,
    styleSet: 'VIEW',
    additionalStyles: [{height, width}],
  });

  const source = htmlAttribs.srcdoc
    ? {html: htmlAttribs.srcdoc}
    : {uri: htmlAttribs.src};

  return <WebView key={passProps.key} source={source} style={style} />;
}

export function pre(
  htlmAttribs,
  children,
  convertedCSSStyles,
  {key, allowFontScaling, textSelectable},
) {
  return (
    <Text
      key={key}
      allowFontScaling={allowFontScaling}
      selectable={textSelectable}
      style={{fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo'}}>
      {children}
    </Text>
  );
}

export function br(
  htlmAttribs,
  children,
  convertedCSSStyles,
  {allowFontScaling, emSize, key},
) {
  // nested text element behave erratically when using height
  // case 1: text \n text... : we need a line break and font size doesn't matter
  // case 2: <div><br></div> : we need a line break with some height
  // case 3: <div><b><br></b></div> : case where nested text adds oddly and we end up with 2 lines
  // hence: we use font size / 2
  return (
    <Text
      allowFontScaling={allowFontScaling}
      style={{fontSize: emSize / 2, flex: 1}}
      key={key}>
      {'\n'}
    </Text>
  );
}

export function textwrapper(
  htmlAttribs,
  children,
  convertedCSSStyles,
  {allowFontScaling, textSelectable, key},
) {
  return (
    <Text
      allowFontScaling={allowFontScaling}
      selectable={textSelectable}
      key={key}
      style={convertedCSSStyles}>
      {children}
    </Text>
  );
}
