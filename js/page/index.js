(function () {

    this.page = function() { };

    page.main = function() {
        terminal.println("//Greetings!\n");

        terminal.setForegroundColor("limegreen");
        terminal.println("**** I am Greenlock! ****");

        terminal.setForegroundColor("lightgreen");
        terminal.println("- Computer Science student");
        terminal.println("- Pharmacy technician");
        terminal.println("- Internet lurker");
        terminal.println("- Casual gamer");
        terminal.println("- Potato");
        terminal.println("- Writer of smol Minecraft softwares");
        terminal.println("- Major skrublord");
        terminal.println("- Green bean");
        terminal.println("- Woodruff Scout Camp Staff");
        terminal.println("- Somewhat not-casual gamer");
        terminal.println("- Maker of compiler prototypes\n");

        terminal.setForegroundColor("silver");
        terminal.print("You can also find me on ");
        terminal.printlink("Twitter", "https://twitter.com/greenlock28");
        terminal.print(" and ");
        terminal.printlink("GitHub", "https://github.com/Greenlock");
        terminal.print(".\n\n");

        terminal.println("This website is supposed to be a shell terminal, but is incomplete at this time. The interactive shell and more content will be coming soon!\n");

        terminal.setForegroundColor("violet");
        terminal.println("*This website is Certified Tasty");
    }

}.call(this));
