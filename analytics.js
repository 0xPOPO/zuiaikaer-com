(function () {
  var config = window.__BLM_ANALYTICS__;
  if (!config || !config.endpoint || !config.siteId) return;

  function send(eventType, payload) {
    var body = JSON.stringify(Object.assign({
      eventType: eventType,
      path: location.pathname,
      referrer: document.referrer || "",
      siteId: config.siteId,
      template: config.template
    }, payload || {}));

    if (navigator.sendBeacon) {
      navigator.sendBeacon(config.endpoint, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      return;
    }

    fetch(config.endpoint, {
      body: body,
      headers: { "content-type": "text/plain;charset=UTF-8" },
      keepalive: true,
      method: "POST",
      mode: "no-cors"
    }).catch(function () {});
  }

  send("pageview");
  document.addEventListener("click", function (event) {
    var target = event.target instanceof Element ? event.target.closest("a") : null;
    if (!target) return;
    var linkId = target.getAttribute("data-blm-link-id");
    var campaignId = target.getAttribute("data-blm-campaign-click");
    if (campaignId) send("campaign_click", { campaignCreativeId: campaignId });
    if (linkId) send("link_click", { linkId: linkId });
  });
})();
