/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.17.0.2716 modeling language!*/

package cruise.umple.compiler;

/**
 * @umplesource StateMachine.ump 160
 * @umplesource StateMachine_Code.ump 443
 */
// line 160 "../../../../src/StateMachine.ump"
// line 443 "../../../../src/StateMachine_Code.ump"
public class Event
{
  @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
  public @interface umplesourcefile{int line();String file();int javaline();int length();}

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Event Attributes
  private String name;
  private String args;
  private boolean isTimer;
  private boolean autoTransition;
  private String timerInSeconds;
  private boolean isInternal;

  //Helper Variables
  private int cachedHashCode;
  private boolean canSetName;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Event(String aName)
  {
    cachedHashCode = -1;
    canSetName = true;
    name = aName;
    args = null;
    isTimer = false;
    autoTransition = false;
    timerInSeconds = "0";
    isInternal = false;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setName(String aName)
  {
    boolean wasSet = false;
    if (!canSetName) { return false; }
    name = aName;
    wasSet = true;
    return wasSet;
  }

  public boolean setArgs(String aArgs)
  {
    boolean wasSet = false;
    args = aArgs;
    wasSet = true;
    return wasSet;
  }

  public boolean setIsTimer(boolean aIsTimer)
  {
    boolean wasSet = false;
    isTimer = aIsTimer;
    wasSet = true;
    return wasSet;
  }

  public boolean setAutoTransition(boolean aAutoTransition)
  {
    boolean wasSet = false;
    autoTransition = aAutoTransition;
    wasSet = true;
    return wasSet;
  }

  public boolean setTimerInSeconds(String aTimerInSeconds)
  {
    boolean wasSet = false;
    timerInSeconds = aTimerInSeconds;
    wasSet = true;
    return wasSet;
  }

  public boolean setIsInternal(boolean aIsInternal)
  {
    boolean wasSet = false;
    isInternal = aIsInternal;
    wasSet = true;
    return wasSet;
  }

  public String getName()
  {
    return name;
  }

  public String getArgs()
  {
    return args;
  }

  public boolean getIsTimer()
  {
    return isTimer;
  }

  public boolean getAutoTransition()
  {
    return autoTransition;
  }

  public String getTimerInSeconds()
  {
    return timerInSeconds;
  }

  /**
   * TODO: how do you specify milliseconds etc.
   */
  public boolean getIsInternal()
  {
    return isInternal;
  }

  public boolean isIsTimer()
  {
    return isTimer;
  }

  public boolean isAutoTransition()
  {
    return autoTransition;
  }

  public boolean isIsInternal()
  {
    return isInternal;
  }

  public boolean equals(Object obj)
  {
    if (obj == null) { return false; }
    if (!getClass().equals(obj.getClass())) { return false; }

    Event compareTo = (Event)obj;
  
    if (name == null && compareTo.name != null)
    {
      return false;
    }
    else if (name != null && !name.equals(compareTo.name))
    {
      return false;
    }

    return true;
  }

  public int hashCode()
  {
    if (cachedHashCode != -1)
    {
      return cachedHashCode;
    }
    cachedHashCode = 17;
    if (name != null)
    {
      cachedHashCode = cachedHashCode * 23 + name.hashCode();
    }
    else
    {
      cachedHashCode = cachedHashCode * 23;
    }

    canSetName = false;
    return cachedHashCode;
  }

  public void delete()
  {}


  public String toString()
  {
	  String outputString = "";
	  
    return super.toString() + "["+
            "name" + ":" + getName()+ "," +
            "args" + ":" + getArgs()+ "," +
            "isTimer" + ":" + getIsTimer()+ "," +
            "autoTransition" + ":" + getAutoTransition()+ "," +
            "timerInSeconds" + ":" + getTimerInSeconds()+ "," +
            "isInternal" + ":" + getIsInternal()+ "]"
     + outputString;
  }  
  //------------------------
  // DEVELOPER CODE - PROVIDED AS-IS
  //------------------------
  // line 445 ../../../../src/StateMachine_Code.ump
  private static int nextAutoTransitionId = 1;

  @umplesourcefile(line=447,file="StateMachine_Code.ump",javaline=213,length=7)
  public static Event createAutoTransition()
  {
    Event e = new Event("__autotransition" + Event.nextAutoTransitionId + "__");
    e.setAutoTransition(true);
    Event.nextAutoTransitionId += 1;
    return e;
  }

}