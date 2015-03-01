/*

 Copyright: All contributers to the Umple Project

 This file is made available subject to the open source license found at:
 http://umple.org/license

 */

package cruise.umple.compiler;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.junit.*;

import cruise.umple.parser.analysis.RuleBasedParser;
import cruise.umple.util.*;

public class UmpleParserFilterTest
{
  UmpleParser parser;
  UmpleModel model;
  String pathToInput;
  String umpleParserName;

  @Before
  public void setUp()
  {
    umpleParserName = "cruise.umple.compiler.UmpleInternalParser";
    pathToInput = SampleFileWriter.rationalize("test/cruise/umple/compiler");
  }

  //@Test
  public void emptyFilter()
  {
	  assertParse("600_emptyFilter.ump", "[filter]");
    Assert.assertNotNull(model.getFilter());
  }

  @Test
  public void simpleFilter()
  {
	  assertParse("601_simpleFilter.ump","[classDefinition][name:School][attribute][name:name][classDefinition][name:Student][classDefinition][name:Mentor][inlineAssociation][inlineAssociationEnd][bound:1][arrow:--][associationEnd][bound:*][type:Student][filter][filterName:Roles][filterValue][classname:Student][classname:Mentor]");
	  Assert.assertNotNull(model.getFilter());
	  String actuals[] = {"Student", "Mentor"};
	  Assert.assertArrayEquals(model.getFilter().getValues(), actuals);
  }

  private void assertParse(String filename, String expectedOutput)
  {
    assertParse(filename, expectedOutput, true);
  }

  private void assertParse(String filename, String expectedOutput, boolean expected)
  {
    UmpleFile file = new UmpleFile(pathToInput, filename);
    model = new UmpleModel(new UmpleFile(pathToInput, filename));
    model.setShouldGenerate(false);
    boolean answer = true;
    RuleBasedParser rbp = new RuleBasedParser(model);
    parser = new UmpleInternalParser(umpleParserName, model, rbp);
    ParseResult result = rbp.parse(file);
    answer = result.getWasSuccess();
    if (answer)
    {
      answer = parser.analyze(false).getWasSuccess();
    }
    if (answer == false && expected)
    {
      if (model.getLastResult() == null)
      {
        System.out.println("Failed for unknown reasons, no 'lastResult' available.");
      }
      else
      {
        System.out.println("failed at:" + model.getLastResult().getPosition());
      }
    }
    Assert.assertEquals(expected, answer);
    if (expected)
    {
      Assert.assertEquals(expectedOutput, parser.toString());
    }

  }

}