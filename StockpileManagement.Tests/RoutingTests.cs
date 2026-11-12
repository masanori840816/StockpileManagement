using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace StockpileManagement.Tests;

[TestClass]
public class RoutingTests
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;

    [TestInitialize]
    public void Initialize()
    {
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            builder.UseContentRoot(Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../StockpileManagement.Api"))));
        _client = _factory.CreateClient();
    }

    [TestCleanup]
    public void Cleanup()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [TestMethod]
    public async Task StockpileRoot_ReturnsSpaDocument()
    {
        var response = await _client.GetAsync("/stockpiles/");

        Assert.AreEqual(System.Net.HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        StringAssert.Contains(content, "<div id=\"root\">");
    }

    [TestMethod]
    public async Task NestedPage_ReturnsSpaDocumentForDirectNavigation()
    {
        var response = await _client.GetAsync("/stockpiles/pages/register");

        Assert.AreEqual(System.Net.HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        StringAssert.Contains(content, "<div id=\"root\">");
    }

    [TestMethod]
    public async Task UnknownApiRoute_DoesNotReturnSpaDocument()
    {
        var response = await _client.GetAsync("/stockpiles/api/not-found");

        Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }
}