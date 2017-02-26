---
published: false
---
## Protected bash 

Getting value from a function 

{% highlight bash linenos %}
get_value()
{
    local cmd="$1"
    
    eval `$cmd`
}

get_value

{% endhighlight %}

However if the argument is null or unset, 


{% highlight bash linenos %}
get_value()
{
    local cmd="${1:-}
    
    eval `$cmd`
}

get_value

{% endhighlight %}

However here is another way to  if the variable is null

{% highlight bash linenos %}

get_value()
{
    local cmd="${1:=}
}

{% endhighlight %}


It is better to begin your test scripts as 

{% highlight bash linenos %}
set -x 
set -e 
{% endhighlight %}

## Protecting the functions

{% highlight bash linenos %}
readonly -f ash::begin_session
{% endhighlight  %}


