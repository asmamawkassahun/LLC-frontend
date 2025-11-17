import { Button } from "../ui";

const ContactForm = () => {
    return (

                <form className="space-y-4 md:space-y-6">
                    {/* Name Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Subject Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <textarea
                            placeholder="Message"
                            rows={6}
                            className="w-full px-4 py-3 bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                        ></textarea>
                    </div>

                        {/* Send Message Button */}
                        <div className="pt-2">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base md:text-lg font-medium">
                                Send message
                            </Button>
                        </div>
                    </form>
    )
}

export default ContactForm;