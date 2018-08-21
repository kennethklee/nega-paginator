/**
A simple paginator for Polymer. There are two types of pagination: basic, and page list. The page list has 3 page buttons shown, while basic has no page list. Just the basic first, next, and prev buttons.

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

@element nega-paginator
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
/**
 * `nega-paginator`
 * A paginator for Polymer.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class NegaPaginator extends Polymer.Element {
  static get template() {
    return Polymer.html`
    <style>
      :host {
        display: block;
        user-select: none;

        @apply --nega-paginator;
      }

      paper-button {
        height: 45px;
        min-width: 50px;
        vertical-align: top;
        border: #ccc 1px solid;
        background: white;

        @apply --nega-paginator-button;
      }

      .active {
        font-weight: bold;

        @apply --nega-paginator-active-button;
      }
    </style>
    
    <paper-button raised="" disabled="[[_computeDisabled(page, 1)]]" on-click="firstPage"><iron-icon icon="icons:first-page"></iron-icon></paper-button>
    <paper-button raised="" disabled="[[_computeDisabled(page, _prevPage)]]" on-click="prevPage"><iron-icon icon="icons:chevron-left"></iron-icon></paper-button>
    <paper-button raised="" hidden="[[_computeHidden(_pageList.0)]]" on-click="_handleChangePage" class\$="[[_computeClass(_pageList.0)]]">[[_pageList.0]]</paper-button>
    <paper-button raised="" hidden="[[_computeHidden(_pageList.1)]]" on-click="_handleChangePage" class\$="[[_computeClass(_pageList.1)]]">[[_pageList.1]]</paper-button>
    <paper-button raised="" hidden="[[_computeHidden(_pageList.2)]]" on-click="_handleChangePage" class\$="[[_computeClass(_pageList.2)]]">[[_pageList.2]]</paper-button>
    <paper-button raised="" hidden="[[_computeHidden(_pageList.3)]]" on-click="_handleChangePage" class\$="[[_computeClass(_pageList.3)]]">[[_pageList.3]]</paper-button>
    <paper-button raised="" hidden="[[_computeHidden(_pageList.4)]]" on-click="_handleChangePage" class\$="[[_computeClass(_pageList.4)]]">[[_pageList.4]]</paper-button>
    <paper-button raised="" disabled="[[_computeDisabled(page, _nextPage)]]" on-click="nextPage"><iron-icon icon="icons:chevron-right"></iron-icon></paper-button>
    <paper-button raised="" disabled="[[_computeDisabled(page, _maxPage)]]" on-click="lastPage"><iron-icon icon="icons:last-page"></iron-icon></paper-button>
`;
  }

  static get is() { return 'nega-paginator'; }
  static get properties() {
    return {
      /**
       * The current page.
       */
      page: {
        type: Number,
        value: 1,
        notify: true,
        reflectToAttribute: true
      },

      /**
       * Items per page.
       */
      pageSize: {
        type: Number,
        value: 10
      },

      /**
       * Total count of items to paginate.
       */
      total: {
        type: Number,
        value: NaN
      },

      _pageList: {
        type: Array,
        value: [1, 2, 3],

        computed: '_computePageList(page, _maxPage)'
      },
      _prevPage: {
        type: Number,
        computed: '_computePrevPage(page, _maxPage)'
      },
      _nextPage: {
        type: Number,
        computed: '_computeNextPage(page, _maxPage)'
      },
      _maxPage: {
        type: Number,
        computed: '_computeMaxPage(page, pageSize, total)'
      }
    }
  }

  /**
  * Helper: Inclusive range array.
  */
  __range(min, max) {
    let results = []
    for (let i = min; i <= max; i++) {
      results.push(i)
    }
    return results
  }

  /**
  * Helper: Clamp number between a min and max. Also handle NaN.
  */
  __clamp(x, min, max) {
    if (isNaN(min) || isNaN(max)) return x;
    return Math.max(min, Math.min(max, x))
  }

  connectedCallback() {
    super.connectedCallback()
    this.page = this.__clamp(this.page, 1, this._maxPage) || 1
  }

  _computePageList(page, maxPage) {
    let n = this.__clamp(page, 3, maxPage - 2)
    return this.__range(Math.max(1, n - 2), Math.min(maxPage, n + 2))
  }

  _computePrevPage(page, maxPage) {
    return this.__clamp(page - 1, 1, maxPage)
  }

  _computeNextPage(page, maxPage) {
    return this.__clamp(page + 1, 1, maxPage)
  }

  _computeMaxPage(page, pageSize, total) {
    return Math.ceil(total / pageSize)
  }

  _computeClass(page) {
    return this.page === page && 'active'
  }

  _computeDisabled(page, checkPage) {
    return isNaN(checkPage) || page === checkPage
  }

  _computeHidden(page) {
    return page === undefined
  }

  _handleChangePage(e) {
    this.changePage(parseInt(e.currentTarget.innerText))
  }

  changePage(page) {
    let newPage = this.__clamp(page, 1, this._maxPage) || 1
    this.page !== newPage && this.set('page', newPage)
  }

  firstPage() {
    this.changePage(1)
  }

  nextPage() {
    this.changePage(this.page + 1)
  }

  prevPage() {
    this.changePage(Math.max(1, this.page - 1))
  }

  lastPage() {
    this.changePage(Math.ceil(this.total / this.pageSize))
  }
}
window.customElements.define(NegaPaginator.is, NegaPaginator);
