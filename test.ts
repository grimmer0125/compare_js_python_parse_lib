// https://github.com/xmldom/xmldom
import { DOMParser } from '@xmldom/xmldom'

function* iterXML(doc: ChildNode | Document): IterableIterator<Element> {
    if (doc.hasChildNodes()) {
        for (let i = 0; i < doc.childNodes.length; i++) {
            const child = doc.childNodes[i];
            yield child as Element
            const generator = iterXML(child)
            let next = generator.next();
            while (next.value) {
                yield next.value
                next = generator.next();
            }
        }
    }
}

const abstract = '<a id="a">123<b id="b">hey!</b><b id="b2">hey2!</b>abc<p><b>55</b></p></a>';
// <a>
//   123
//   <b>   
//     hey 
//   </b>    
//   <b>   
//     hey2
//   </b>
//   abc
//   <p>
//     <b>
//       55 
//     </b>  
//   </p>
// <a/>     

const parser = new DOMParser();
const doc: Document = parser.parseFromString(abstract, "application/xml");
console.log("start:", doc.childNodes.length, doc.textContent) // document has no textContent
for (const xml of iterXML(doc)) {
    // 0. python definition: xml element does not contain $text type https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.find
    //    $text is belonging to a element's text/tail. But there is a $text non-element node in JS. 
    //    https://www.w3.org/TR/2006/REC-xml11-20060816/ xml spec does not have tail definition which is Python xml' definition only. 
    // 1. textContent contains all child's textContent (self text in Python xml + others)+ nextSibling(tail text)
    // 2. nextSibling?.nodeValue is = tail in Python xml
    // 3. if it is a string and it will have nodeVale. Besides, we can also use tagName=undefined, or nodeName=#text to tell it is a string 
    // 4. xml.attributes = python xml attrib 
    // 5. python xml's self text = doc.childNodes?.[0].nodeValue has value case. Others are null or undefined. 
    // 6  in python: just use for child in element
    // 7. JS: https://www.geeksforgeeks.org/what-is-the-difference-between-children-and-childnodes-in-javascript/
    // The main difference between children and childNodes property is that children work upon elements and childNodes on nodes including non-element nodes like text and comment nodes.
    // BTW, @xmldom/xmldom does not implement children yet. 
    console.log("el:", xml.tagName, xml.nodeName, xml.nodeValue, xml.textContent, xml.nextSibling?.nodeValue, xml.attributes, xml.childNodes?.[0].nodeValue)
    console.log()
}
console.log("end")
