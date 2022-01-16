import com.amazonaws.services.glue.ChoiceOption
import com.amazonaws.services.glue.MappingSpec
import com.amazonaws.services.glue.ResolveSpec
import com.amazonaws.services.glue.errors.CallSite
import com.amazonaws.services.glue.util.GlueArgParser
import com.amazonaws.services.glue.util.Job
import com.amazonaws.services.glue.util.JsonOptions
import org.apache.spark.SparkContext
import scala.collection.JavaConverters._
import com.amazonaws.services.glue.log.GlueLogger
import com.amazonaws.services.glue.{DynamicFrame, GlueContext}

object GlueApp {
  def main(sysArgs: Array[String]) {
    val spark: SparkContext = new SparkContext()
    val glueContext: GlueContext = new GlueContext(spark)
    // @params: [JOB_NAME]
    val args = GlueArgParser.getResolvedOptions(sysArgs, Seq("JOB_NAME", "resolveCols").toArray)
    Job.init(args("JOB_NAME"), glueContext, args.asJava)
    val logger = new GlueLogger
    val resolveCols = args("resolveCols")
    
    

    var rawDF = glueContext.getCatalogSource(database = "ml_datalake_dev",
                                             tableName = "govcorp_asset",
                                             redshiftTmpDir = "",
                                             transformationContext = "").getDynamicFrame()

    println("Testing1")
    println(rawDF.printSchema())
    
    if (resolveCols.trim() != "NA") {
        val resolveColsList =  resolveCols.split('|').map(_.trim).toList
    
        for (rCols <- resolveColsList) {
            val rCol = rCols.split(':').map(_.trim).toList
        
            val resolved_col = rCol(0)
          
            val resolved_dtype = rCol(1)
        
        
            rawDF = rawDF.resolveChoice(specs = Seq((resolved_col, s"cast:${resolved_dtype}")))
        }
    }
  
    
    
    var medicareDf = rawDF.toDF()

    Job.commit()
  }
}
