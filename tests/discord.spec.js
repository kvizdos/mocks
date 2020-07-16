const DiscordMock = require("../discord");

describe("Mock Discord Unit Tests", () => {
    describe("Guild tests", () => {
        it("should add a role", () => {
            const Guild = new DiscordMock.Guild()
            Guild.roles.cache.add("Test");

            expect(Guild.roles.cache.roles).toHaveLength(1);
            expect(Guild.roles.cache.roles[0].name).toBe("Test");
        })

        it("should fetch a role", () => {
            const Guild = new DiscordMock.Guild();
            Guild.roles.cache.add("Test");

            const found = Guild.roles.cache.find((role) => {
                return role.name == "Test";
            })

            expect(found.name).toBe("Test")
        })

        it("shouldn't fetch an invalid role", () => {
            const Guild = new DiscordMock.Guild();

            const found = Guild.roles.cache.find((role) => {
                return role.name == "Test";
            })

            expect(found).toBe(undefined)
        })

        it("should add a mock member", () => {
            const Guild = new DiscordMock.Guild();
            Guild.members.add({
                id: "Test"
            });

            expect(Guild.members.members).toHaveLength(1);
            expect(Guild.members.members[0].id).toBe("Test");
        })

        it("should find a mock member", () => {
            const Guild = new DiscordMock.Guild();
            Guild.members.add({
                id: "Test"
            });

            expect(Guild.members.fetch("Test").id).toBe("Test");
            expect(Guild.members.fetch("Test").user.id).toBe("Test");
        })

        it("shouldn't find an inexistent mock member", () => {
            const Guild = new DiscordMock.Guild();
            Guild.members.add({
                id: "Test"
            });

            expect(Guild.members.fetch("Test2").id).toBe(undefined);
            expect(Guild.members.fetch("Test2").user).toBe(undefined);
        })
    })

    describe("Member tests", () => {
        it("should create a member with a random ID", () => {
            const Guild = new DiscordMock.Guild();
            const Member = new DiscordMock.Member(Guild);

            expect(Member.id).not.toBe(undefined);
        })

        it("should create a member with a set ID", () => {
            const Guild = new DiscordMock.Guild();
            const Member = new DiscordMock.Member(Guild, "My Test ID");

            expect(Member.id).toBe("My Test ID");
        })


        it("should add a role to a mock member", () => {
            const Guild = new DiscordMock.Guild();
            const Member = new DiscordMock.Member(Guild);

            Member.roles.add("Test");

            expect(Member.roles.roles).toHaveLength(1);
            expect(Member.roles.roles[0]).toBe("Test")
        })

        it("should remove a role from a mock member", () => {
            const Guild = new DiscordMock.Guild();
            const Member = new DiscordMock.Member(Guild);

            Member.roles.add("Test");
            Member.roles.remove("Test");

            expect(Member.roles.roles).toHaveLength(0);
        })

        it("shouldnt fail to remove an invalid role", () => {
            const Guild = new DiscordMock.Guild();
            const Member = new DiscordMock.Member(Guild);

            Member.roles.remove("Test");

            expect(Member.roles.roles).toHaveLength(0);
        })
    })

    describe("Channel tests", () => {
        it("should create a channel with a random ID", () => {
            const Channel = new DiscordMock.Channel();

            expect(Channel.id).not.toBe(undefined)
        })

        it("should create a channel with a set ID", () => {
            const Channel = new DiscordMock.Channel("Test");

            expect(Channel.id).toBe("Test")
        })

        it("should create a channel that is marked as NSFW", () => {
            const Channel = new DiscordMock.Channel("Test", true);

            expect(Channel.id).toBe("Test")
            expect(Channel.nsfw).toBe(true)
        })
    })

    describe("Message tests", () => {
        it("Should create a message with fake data", () => {
            const Message = new DiscordMock.Message("Test author", "Test message", [], "Test channel", "Test guild");

            expect(Message.content).toBe("Test message");
            expect(Message.attachments.size).toBe(0);
            expect(Message.author).toBe("Test author");
            expect(Message.guild).toBe("Test guild");
            expect(Message.channel).toBe("Test channel");
        })

        it("Should create a message with fake data and attachments", () => {
            const Message = new DiscordMock.Message("Test author", "Test message", [{image: true}], "Test channel", "Test guild");

            expect(Message.attachments.size).toBe(1);
            expect(Message.attachments.attachments[0].image).toBe(true);
        })

        it("should be able to reply to a message", () => {
            const Message = new DiscordMock.Message({id: 1234}, "Test message", [{image: true}], "Test channel", "Test guild");

            Message.reply("Hello!");

            expect(Message.replyStatus).toBe("<@1234>, Hello!")
        })
    })
})