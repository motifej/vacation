export default function config ($logProvider, toastrConfig) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 2000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.progressBar = true;

}
