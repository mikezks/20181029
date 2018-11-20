import { browser, element, by, ElementFinder, protractor, ElementArrayFinder } from 'protractor';

describe('Flight Search', () => {
    let from: ElementFinder;
    let to: ElementFinder;
    let search: ElementFinder;
    let flights: ElementArrayFinder;
    let firstFlight: ElementFinder;
    let matCard: ElementFinder;

    beforeEach(() => {
        browser.get('http://localhost:4299');
        // Maximize browser to show nav-sidebar and flight-search item
        browser.manage().window().maximize();

        // Navigate to flight-search component
        const navigate = element(by.css('[routerlink=flight-search]'));
        navigate.click();

        from = element(by.css('input[name=from]'));
        from.clear();
        from.sendKeys('Graz');

        to = element(by.css('input[name=to]'));
        to.clear();
        to.sendKeys('Hamburg');

        search = element(by.cssContainingText('button', 'Suchen'));
        search.click();

        flights = element.all(by.tagName('app-flight-card'));
        firstFlight = flights.first();
        matCard = firstFlight.element(by.tagName('mat-card'));
    });

    it('should show one flight card after search', () => {
        expect(flights.count()).toBe(1);
    });

    it('should verify card background color change: initially/unselected, on hover, after mouse click select', () => {
        const selectFlight = firstFlight.element(by.cssContainingText('mat-icon', 'add'));
        const white = 'rgba(255, 255, 255, 1)';
        const lightsteelblue = 'rgba(176, 196, 222, 1)';

        // Check CSS background-color as RGBA value because color is defined in CSS class
        let matCardBackground = matCard.getCssValue('background-color');
        expect(matCardBackground).toBe(white);

        // MouseMove to hover element an force background color change
        // Check CSS background-color as RGBA value because color is defined in CSS class
        browser.sleep(1000);
        browser.actions().mouseMove(selectFlight).perform();
        matCardBackground = matCard.getCssValue('background-color');
        expect(matCardBackground).toBe(lightsteelblue);

        // MouseClick to select flight card
        // Check CSS background-color by name because color is defined in element's style attribute
        browser.sleep(1000);
        browser.actions().click().perform();
        matCardBackground = matCard.getAttribute('style');
        expect(matCardBackground).toContain('background-color: steelblue');
        browser.sleep(1000);
    });

    it('should disable search button if from is empty', () => {
        // Force interaction with sendKeys to update Angular binding for disabled button state
        from.clear();
        from.sendKeys(' ', protractor.Key.BACK_SPACE);
        expect(search.isEnabled()).toBe(false);
        browser.sleep(1000);
    });

    it('should enable search button if from and to have values', () => {
        from.clear();
        from.sendKeys('Graz');
        to.clear();
        to.sendKeys('Hamburg');
        expect(search.isEnabled()).toBe(true);
        browser.sleep(1000);
    });
});
