/**
 
 A simple paginator web component. There are two types of pagination: basic, and page list. The page list has 3 page buttons shown, while basic has no page list. Just the basic first, next, and prev buttons.
 
 Example:
 
 ```
 Basic pagination: <nega-paginator page="1"></nega-paginator>
 
 Pagination with page list: <nega-paginator page="1" page-size="10" total="100"></nega-paginator>
 ```
 
 The following custom properties and mixins are also available for styling:
 Custom property | Description | Default
 ----------------|-------------|----------
 `--nega-paginator` | Mixin applied to the paginator | `{}`
 `--nega-paginator-button` | Mixin applied to the buttons. | `{}`
 `--nega-paginator-active-button` | Mixin applied to the active button. | `{}`
 `--nega-paginator-disabled-button` | Mixin applied to the disabled button. | `{}`
 
 @element nega-paginator
 @demo demo/index.html
 */

import {LitElement, html} from 'lit-element';

/**
* Helper: Inclusive range array.
*/
function __range(min, max) {
  let results = []
  for (let i = min; i <= max; i++) {
    results.push(i)
  }
  return results
}

/**
* Helper: Clamp number between a min and max. Also handle NaN.
*/
function __clamp(x, min, max) {
  if (isNaN(min) || isNaN(max)) return x;
  return Math.max(min, Math.min(max, x))
}

/**
 * `nega-paginator`
 * A simple paginator web component.
 * 
 * @customElement
 * @demo demo/index.html
 */
class NegaPaginator extends LitElement {
  static get properties() {
    return {
      page: {type: Number, reflect: true},
      pageSize: {type: Number},
      total: {type: Number},
      pagePadding: {type: Number},
    }
  }

  constructor() {
    super()
    this.page = 1
    this.pageSize = 10
    this.pagePadding = 2
  }
  
  render() {
    // Cache computed
    let previousPage = this.previousPage
    let nextPage = this.nextPage
    let lastPage = this.lastPage

    let centroid = __clamp(this.page, 1 + this.pagePadding, lastPage - this.pagePadding)
    let pageList = __range(Math.max(1, centroid - this.pagePadding), Math.min(lastPage, centroid + this.pagePadding))

    return html`
    <style>
      :host {
        display: block;
        user-select: none;
      }

      button {
        height: 46px;
        width: 50px;
        vertical-align: top;
        border: #ccc 1px solid;
        background: white;
        overflow: visible;

        @apply --nega-paginator-button;
      }

      .active {
        font-weight: bold;
        border-color: #999;

        @apply --nega-paginator-active-button;
      }

      [disabled] {
        color: #ccc;
        border: #ddd;

        @apply --nega-paginator-disabled-button;
      }
    </style>
    
    <button ?disabled=${this._computeIsDisabled(this.page, 1)} @click=${_ => this.changePage(1)}>|&lt;</iron-icon></button>
    <button ?disabled=${this._computeIsDisabled(this.page, previousPage)} @click=${_ => this.changePage(previousPage)}>&lt;</iron-icon></button>
    ${pageList.map(page => html`
      <button @click=${_ => this.changePage(page)} class=${this.page === page && 'active'}>${page}</button>
    `)}
    <button ?disabled=${this._computeIsDisabled(this.page, nextPage)} @click=${_ => this.changePage(nextPage)}>&gt;</iron-icon></button>
    <button ?disabled=${this._computeIsDisabled(this.page, lastPage)} @click=${_ => this.changePage(lastPage)}>&gt;|</button>
    `
  }

  updated(changed) {
    if (changed.has('page')) {
      let clampedPage = this.page && __clamp(this.page, 1, this.lastPage) || 1
      if (this.page !== clampedPage) {
        this.page = clampedPage  // Handle errors
      }
    }
  }

  get lastPage() {
    return Math.ceil(this.total / this.pageSize)
  }

  get nextPage() {
    return __clamp(this.page + 1, 1, this.lastPage)
  }

  get previousPage() {
    return __clamp(this.page - 1, 1, this.lastPage)
  }

  get value() {
    return this.page;
  }

  set value(page) {
    this.changePage(page)
  }

  _computeIsDisabled(page, checkPage) {
    return isNaN(checkPage) || page === checkPage
  }

  changePage(page) {
    page = page && __clamp(page, 1, this.lastPage) || 1
    if (this.page !== page) {
      this.page = page
  
      this.dispatchEvent(new CustomEvent('change', {detail: {value: this.page}, composed: true, bubbles: true}))
    }
  }
}
window.customElements.define('nega-paginator', NegaPaginator)
