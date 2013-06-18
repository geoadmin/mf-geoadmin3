<form ng-controller="GaPrintController" ng-submit="submit()">
  <div>
    <label>Layout</label>
    <select ng-model="layout" ng-options="l.name for l in capabilities.layouts"></select>
  </div>
  <div>
    <label>Scale</label>
    <select ng-model="scale" ng-options="s.name for s in capabilities.scales"></select>
  </div>
  <div class="checkbox">
    <label>
      <input ng-model="legend" type="checkbox">Legend
    </label>
  </div>
  <button type="submit" class="btn btn-primary">Print</button>
</form>
