import React, { Component } from 'react';
class PricesPage extends Component {
  render() {
    return (
      <div className="page-content">
        <p>Pricing is as custom as the sessions, but we get asked about package prices frequently.</p>
        <p>Generally speaking, the price runs approximately $75/hr. </p>
        <p>Here is what is included:</p>
        <ul>
          <li>Photo session customized to the needs and desires of the client.</li>
          <li>Digital sessions:
            <ul>
              <li> Includes all images, processed into high resolution - print ready files suitable to take to a lab for printing.</li>
              <li>Up to 5 images touched up and resized up to 16x24 for enlargements.</li>
              <li>CDs of files.</li>
              <li>Upon request, a web album can be generated as well. This can be used to put on a web site, or used to conveniently view session from CD.</li>
              <li>Prints will be made upon request. Cost is $20 additional, plus materials times 2. </li>
            </ul>
          </li>
          <li>Photographers Release so you can make as many prints from the CD's as you wish for non-commercial purposes.</li>
        </ul>
        <p>Anything additional that can be done by us, we would be glad to do, at an extra cost as would be customary.</p>
        <p>Examples: </p>
        <ul>
          <li>Portraits / Families / Senior sessions range from $80 - $300 depending on time spent,
            and you get to make as many prints from the CDs as you wish with 1 additional CD
            prepared for the school with your selected image for the yearbook.
          </li>
        </ul>
        <p>Guaranty:
        </p>
        <ul>
          <li>If you don't like the work, you don't have to keep or pay for it. Simple as that.</li>
          <li>CDs: If you have a problem with the recorded CDs, just let me know within 2 weeks and I'll re-burn them.
            I'll keep the files needed to do that for 2 weeks. </li>
        </ul>
      </div>
    )
  }
}
export default PricesPage;