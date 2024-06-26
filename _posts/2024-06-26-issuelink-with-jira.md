---
layout: post
title: 
image: 'https://unsplash.com/photos/GiIZSko7Guk/download?w=800'
thumb: 'https://unsplash.com/photos/GiIZSko7Guk/download?w=800'
category: blog
tags:
 - jira
---

Issue Links in Jira allow you to create meaningful relationships between different issues. These links help in maintaining traceability and provide a clear context for related work items.<!-- truncate_here -->

Issue Links in Jira allow you to create meaningful relationships between different issues. These links help in maintaining traceability and provide a clear context for related work items.

Before creating a link, it's important to know what types of links are available in your Jira instance. You can retrieve this information using the following API endpoint:

```
GET https://your-jira-instance.atlassian.net/rest/api/3/issueLinkType
```

This request will return a list of all available issue link types. The response will include entries like:

```json
{
    "issueLinkTypes": [
        {
            "name": "Relates",
            "inward": "relates to",
            "outward": "relates to"
        },
        {
            "name": "Report",
            "inward": "is report of",
            "outward": "has report"
        },
        // ... other link types ...
    ]
}
```

For linking a `Test Execution Report` to a `Test Plan`, the "Report" link type is particularly relevant.

Once you've identified the appropriate link type, you can create the link between your Test Execution Report and Test Plan. Here's a Groovy script that demonstrates how to do this:



```bash
    def linkIssueToTestPlan(linkType, issueKey, testPlanKey) {

        def issueLink = "https://your-jira-instance.atlassian.net/rest/api/3/issueLink"

        def payload = """{
            "type": {
                "name": "$linkType"
            },
            "inwardIssue": {
                "key": "$testPlanKey"
            },
            "outwardIssue": {
                "key": "$issueKey"
            }
        }"""

            try {
                def response = sh(script: """
                    curl -s -u "\${JIRA_USER}:\${JIRA_TOKEN}" \
                    -X POST \
                    -H "Content-Type: application/json" \
                    "${issueLink}" \
                    -d '${JsonOutput.toJson(payload)}'
                """, returnStdout: true).trim()
        
                println "Link created successfully: ${response}"
            } catch(error) {
                error("Error occurred while linking issue to test plan: ${error.getMessage()}")
            }
        }
    }
```