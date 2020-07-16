/** @module Discord */
class Message {
    /**
     * This creates a mock message
     * @constructor
     * @param {Member} author - Member that this message belongs to 
     * @param {string} content - Message contents (text) 
     * @param {Object[]} attachments - Any message attachments (images) 
     * @param {Channel} channel - Channel that this message belongs to 
     * @param {Guild} guild - Guild that this message is in
     */
    constructor(author, content, attachments, channel, guild) {
        this.authorInfo = author;
        this.activeChannel = channel;
        this.message = content;
        this.msgGuild = guild;
        this.attachmentsInfo = {
            size: attachments.length,
            attachments: attachments 
        };
        this.replyStatus = undefined;
    }

    /**
     * Reply to a users message (saves output to .replyStatus)
     * @param {string} message - Message content
     * @returns {void}
     */
    reply(message) {
        this.replyStatus = `<@${this.author.id}>, ${message}`;
    }

    /**
     * Get the text contents of this message
     * @type {string}
     */
    get content() {
        return this.message;
    }

    /**
     * Get the attachments of this message
     * @type {Object[]}
     */
    get attachments() {
        return this.attachmentsInfo;
    }

    /**
     * Get the author of this message
     * @type {Member}
     */
    get author() {
        return this.authorInfo;
    }

    /**
     * Get the guild of this message
     * @type {Guild}
     */
    get guild() {
        return this.msgGuild;
    }

    /**
     * Get the channel of this message
     * @type {Channel}
     */
    get channel() {
        return this.activeChannel;
    }
}

class Guild {
    /**
     * Creates a mock guild
     * @constructor
     */
    constructor() {
        /**
         * Contains all role information for this guild
         */
        this.roles = {
            /**
             * Roles cache
             */
            cache: {
                /**
                 * List of roles
                 * @type {array}
                 */
                roles: [],
                /**
                 * Finds a certain role
                 * @param {function} findStatement 
                 */
                find(findStatement) {
                    return this.roles.filter(role => findStatement(role))[0];
                },
                /**
                 * Creates a role in the mock guild
                 * @param {string} name - Specifies role name 
                 */
                add(name) {
                    this.roles.push({name: name})
                }
            }
        },
        /**
         * Contains all of the members in this guild.
         * @type {Object}
         * @namespace
         */
        this.members = {
            /**
             * Contains a list of every member in the guild. It is not recommended to directly access.
             * @type {Member[]}
             */
            members: [],
            /**
             * Find a user object inside of this Guild 
             * @param {number} id - Member ID that you are trying to find
             */
            fetch(id) {
                let ret = this.members.filter(member => {
                    return member.id == id
                })[0];

                ret = {...ret, user: ret}

                return ret;
            },
            /**
             * Adds a Member to this Guild
             * @param {Member} Member - Member to be added 
             */
            add(Member) {
                this.members.push(Member);
            }
        }
    }
}

class Member {
    /**
     * Creates a mock member
     * @param {Guild} guild - Guild that this member belongs to 
     * @param {number=} id - Unique member ID
     */
    constructor(guild, id = Math.floor(Math.random() * 100000) + 100) {
        this.id = id;
        this.guild = guild;
        this.username = id;
        /**
         * All of the guilds roles
         * @namespace
         */
        this.roles = {
            /**
             * All of the Role IDs that this user is in.
             * @type {number[]}
             */
            roles: [],
            /**
             * Add a role to a user
             * @param {number} id - Role ID 
             */
            add(id) {
                this.roles.push(id)
            },
            /**
             * Remove a role from a user
             * @param {number} id - Role ID
             */
            remove(id) {
                const index = this.roles.indexOf(id);
                this.roles.splice(index, 1);
            }
        }

        guild.members.add(this);
    }
}

class Channel {
    /**
     * Creates a mock channel
     * @param {number=} id - Unique channel ID
     * @param {boolean=} isNSFW - Marks this channel as NSFW
     */
    constructor(id = Math.floor(Math.random() * 10000), isNSFW = false) {
        this.id = id;
        this.nsfwStatus = isNSFW;
    }

    /**
     * Returns whether or not this channel is NSFW
     * @return {boolean}
     */
    get nsfw() {
        return this.nsfwStatus;
    }
}

module.exports.Message = Message;
module.exports.Guild = Guild;
module.exports.Member = Member;
module.exports.Channel = Channel;