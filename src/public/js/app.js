window.addEventListener('load', () => {
  const el = $('#app');

  // Compile Handlebar Templates
  const errorTemplate = Handlebars.compile($('#error-template').html());
  const simulationTemplate = Handlebars.compile($('#simulation-template').html());

  // Router Declaration
  const router = new Router({
    mode: 'history',
    page404: (path) => {
      const html = errorTemplate({
        color: 'yellow',
        title: 'Error 404 - Page NOT Found!',
        message: `The path '/${path}' does not exist on this site`,
      });
      el.html(html);
    },
  });

  // Instantiate API Handler (API Client for Communicating with Proxy Server)
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 0, // Do not time out requests.
  });

  // Display Error Banner (Server-Side Failure)
  const showError = (error) => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: 'red', title, message });
    el.html(html);
  };

  // Perform POST Request: Calculate + Display Simulation Results
  const getSimulationResults = async () => {
    // Extract form data
    const timeWindow = $('#timeWindow').val();
    const coneTimeMean = $('#coneTimeMeanMins').val();
    const coneTimeStdDevMins = $('#coneTimeStdDevMins').val();
    const custArrivalMeanMins = $('#custArrivalMeanMins').val();
    const simRuns = $('#simRuns').val();

    // Send POST Data to Express (Proxy) Server
    try {
      const response = await api.post('/simulate', {
        timeWindow,
        coneTimeMean,
        coneTimeStdDevMins,
        custArrivalMeanMins,
        simRuns,
      });
      const { medianWaitTimeForVIP } = response.data;
      const result = medianWaitTimeForVIP;
      $('#result2').html(`median wait time (min): ${result}`);
    } catch (error) {
      showError(error);
    } finally {
      $('#result-segment2').removeClass('loading');
    }
  };

  // Handle "Run Simulation" Button Click Event
  const simulationHandler = () => {
    if ($('.ui.form').form('is valid')) {
      // hide error message
      $('.ui.error.message').hide();
      // Post to Express server
      $('#result-segment2').addClass('loading');
      // getConversionResults();
      getSimulationResults();
      // Prevent page from submitting to server
      return false;
    }
    return true;
  };

  router.add('/', async () => {
    // Display Loader First
    const html = simulationTemplate();
    el.html(html);
    try {
      $('.loading').removeClass('loading');
      // Validate Form Inputs
      $('.ui.form').form({
        fields: {
          timeWindow: ['number', 'empty'],
          simRuns: ['number', 'empty'],
          coneTimeMeanMins: ['number', 'empty'],
          coneTimeStdDevMins: ['number', 'empty'],
          custArrivalMeanMins: ['number', 'empty'],
        },
      });
      // Specify Submit Handler
      $('.submit').click(simulationHandler);
    } catch (error) {
      showError(error);
    }
  });

  // Navigate App to Current Url
  router.navigateTo(window.location.pathname);

  // Highlight Active Menu on Refresh/Page Reload
  const link = $(`a[href$='${window.location.pathname}']`);
  link.addClass('active');

  $('a').on('click', (event) => {
    // Block Browser Page Load
    event.preventDefault();

    // Highlight Active Menu on Click
    const target = $(event.target);
    $('.item').removeClass('active');
    target.addClass('active');

    // Navigate to Clicked Url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  });
});
