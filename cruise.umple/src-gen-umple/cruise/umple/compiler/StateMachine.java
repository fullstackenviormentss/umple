/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.15.0.963 modeling language!*/

package cruise.umple.compiler;
import cruise.umple.util.*;
import java.util.*;

public class StateMachine
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //StateMachine Attributes
  private String name;

  //StateMachine Associations
  private UmpleClass umpleClass;
  private State parentState;
  private List<State> states;
  private List<TraceDirective> traceDirectives;

  //Helper Variables
  private int cachedHashCode;
  private boolean canSetParentState;
  private boolean canSetName;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public StateMachine(String aName)
  {
    name = aName;
    states = new ArrayList<State>();
    traceDirectives = new ArrayList<TraceDirective>();
    cachedHashCode = -1;
    canSetParentState = true;
    canSetName = true;
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

  public String getName()
  {
    return name;
  }

  public UmpleClass getUmpleClass()
  {
    return umpleClass;
  }

  public State getParentState()
  {
    return parentState;
  }

  public State getState(int index)
  {
    State aState = states.get(index);
    return aState;
  }

  public List<State> getStates()
  {
    List<State> newStates = Collections.unmodifiableList(states);
    return newStates;
  }

  public int numberOfStates()
  {
    int number = states.size();
    return number;
  }

  public boolean hasStates()
  {
    boolean has = states.size() > 0;
    return has;
  }

  public int indexOfState(State aState)
  {
    int index = states.indexOf(aState);
    return index;
  }

  public TraceDirective getTraceDirective(int index)
  {
    TraceDirective aTraceDirective = traceDirectives.get(index);
    return aTraceDirective;
  }

  public List<TraceDirective> getTraceDirectives()
  {
    List<TraceDirective> newTraceDirectives = Collections.unmodifiableList(traceDirectives);
    return newTraceDirectives;
  }

  public int numberOfTraceDirectives()
  {
    int number = traceDirectives.size();
    return number;
  }

  public boolean hasTraceDirectives()
  {
    boolean has = traceDirectives.size() > 0;
    return has;
  }

  public int indexOfTraceDirective(TraceDirective aTraceDirective)
  {
    int index = traceDirectives.indexOf(aTraceDirective);
    return index;
  }

  public boolean setUmpleClass(UmpleClass aUmpleClass)
  {
    boolean wasSet = false;
    UmpleClass existingUmpleClass = umpleClass;
    umpleClass = aUmpleClass;
    if (existingUmpleClass != null && !existingUmpleClass.equals(aUmpleClass))
    {
      existingUmpleClass.removeStateMachine(this);
    }
    if (aUmpleClass != null)
    {
      aUmpleClass.addStateMachine(this);
    }
    wasSet = true;
    return wasSet;
  }

  public boolean setParentState(State aParentState)
  {
    boolean wasSet = false;
    if (!canSetParentState) { return false; }
    State existingParentState = parentState;
    parentState = aParentState;
    if (existingParentState != null && !existingParentState.equals(aParentState))
    {
      existingParentState.removeNestedStateMachine(this);
    }
    if (aParentState != null)
    {
      aParentState.addNestedStateMachine(this);
    }
    wasSet = true;
    return wasSet;
  }

  public static int minimumNumberOfStates()
  {
    return 0;
  }

  public State addState(String aName)
  {
    return new State(aName, this);
  }

  public boolean addState(State aState)
  {
    boolean wasAdded = false;
    if (states.contains(aState)) { return false; }
    StateMachine existingStateMachine = aState.getStateMachine();
    boolean isNewStateMachine = existingStateMachine != null && !this.equals(existingStateMachine);
    if (isNewStateMachine)
    {
      aState.setStateMachine(this);
    }
    else
    {
      states.add(aState);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeState(State aState)
  {
    boolean wasRemoved = false;
    //Unable to remove aState, as it must always have a stateMachine
    if (!this.equals(aState.getStateMachine()))
    {
      states.remove(aState);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  public static int minimumNumberOfTraceDirectives()
  {
    return 0;
  }

  public boolean addTraceDirective(TraceDirective aTraceDirective)
  {
    boolean wasAdded = false;
    if (traceDirectives.contains(aTraceDirective)) { return false; }
    traceDirectives.add(aTraceDirective);
    if (aTraceDirective.indexOfStateMachine(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aTraceDirective.addStateMachine(this);
      if (!wasAdded)
      {
        traceDirectives.remove(aTraceDirective);
      }
    }
    return wasAdded;
  }

  public boolean removeTraceDirective(TraceDirective aTraceDirective)
  {
    boolean wasRemoved = false;
    if (!traceDirectives.contains(aTraceDirective))
    {
      return wasRemoved;
    }

    int oldIndex = traceDirectives.indexOf(aTraceDirective);
    traceDirectives.remove(oldIndex);
    if (aTraceDirective.indexOfStateMachine(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aTraceDirective.removeStateMachine(this);
      if (!wasRemoved)
      {
        traceDirectives.add(oldIndex,aTraceDirective);
      }
    }
    return wasRemoved;
  }

  public boolean equals(Object obj)
  {
    if (obj == null) { return false; }
    if (!getClass().equals(obj.getClass())) { return false; }

    StateMachine compareTo = (StateMachine)obj;
  
    if (parentState == null && compareTo.parentState != null)
    {
      return false;
    }
    else if (parentState != null && !parentState.equals(compareTo.parentState))
    {
      return false;
    }

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
    if (parentState != null)
    {
      cachedHashCode = cachedHashCode * 23 + parentState.hashCode();
    }
    else
    {
      cachedHashCode = cachedHashCode * 23;
    }
    if (name != null)
    {
      cachedHashCode = cachedHashCode * 23 + name.hashCode();
    }
    else
    {
      cachedHashCode = cachedHashCode * 23;
    }

    canSetParentState = false;
    canSetName = false;
    return cachedHashCode;
  }

  public void delete()
  {
    if (umpleClass != null)
    {
      UmpleClass placeholderUmpleClass = umpleClass;
      this.umpleClass = null;
      placeholderUmpleClass.removeStateMachine(this);
    }
    if (parentState != null)
    {
      State placeholderParentState = parentState;
      this.parentState = null;
      placeholderParentState.removeNestedStateMachine(this);
    }
    for(State aState : states)
    {
      aState.delete();
    }
    ArrayList<TraceDirective> copyOfTraceDirectives = new ArrayList<TraceDirective>(traceDirectives);
    traceDirectives.clear();
    for(TraceDirective aTraceDirective : copyOfTraceDirectives)
    {
      aTraceDirective.removeStateMachine(this);
    }
  }
  
  //------------------------
  // DEVELOPER CODE - PROVIDED AS-IS
  //------------------------
  
  public Event getEvent(String eventName)
  {
    if (eventName == null)
    {
      return null;
    }
    for (State aState : states)
    {
      for (int i=0; i<aState.numberOfTransitions(); i++)
      {
        Transition aTransition = aState.getTransition(i);
        Event e = aTransition.getEvent();
        if (e != null && eventName.equals(e.getName()))
        {
          return e;
        }
      }
    }
    return null;
  }
  
  public List<Event> getEvents()
  {
    ArrayList<Event> allEvents = new ArrayList<Event>();
    
    for (State aState : states)
    {
      for (int i=0; i<aState.numberOfTransitions(); i++)
      {
        Transition aTransition = aState.getTransition(i);
        Event e = aTransition.getEvent();
        if (e != null && !allEvents.contains(e))
        {
          allEvents.add(e);
        }
      }
    }
    return allEvents;
  }

  public State findState(String aName)
  {
    return findState(aName,true);
  }

  public State findState(String aName, boolean searchNestedStateMachines)
  {
    return findState(aName,searchNestedStateMachines,false); 
  } 
  
  public Event findOrCreateEvent(String aName)
  {
    for (Event aEvent : getEvents())
    {
      if (aEvent.getName().equals(aName))
      {
        return aEvent;
      }
    }  
    return new Event(aName);
  }
  
  public State getStartState()
  {
    for (State aState : states)
    {
      if (aState.getIsStartState())
      {
        return aState;
      }
    }
    return null;
  }
  
  public String getType()
  {
    for (State aState : states)
    {
      if (aState.getType() == "Complex")
      {
        return "Complex";
      }
    }
    return "Simple";
  }
  
  public List<StateMachine> getNestedStateMachines()
  {
    ArrayList<StateMachine> all = new ArrayList<StateMachine>();
    addNestedStateMachinesTo(all,this);
    return all;
  }
  
  private void addNestedStateMachinesTo(List<StateMachine> all, StateMachine sm)
  {
    for (State s : sm.states)
    {
      for (StateMachine nestedSm : s.getNestedStateMachines())
      {
        all.add(nestedSm);
        addNestedStateMachinesTo(all,nestedSm);
      }
    }
  }
  
  private State findState(String aName, boolean searchNestedStateMachines, boolean didFindRoot)
  {
  
    StateMachine root = this;
    State parent = getParentState();
    if (!didFindRoot && searchNestedStateMachines && parent != null)
    {
      root = parent.getStateMachine();
      parent = root.getParentState();
    }
    
    for (State aState : root.states)
    {
      if (aState.getName().equals(aName))
      {
        return aState;
      }
      
      if (searchNestedStateMachines)
      {
        for (StateMachine nestedSm : aState.getNestedStateMachines()) 
        {
          State potentialMatch = nestedSm.findState(aName,true,true);
          if (potentialMatch != null)
          {
            return potentialMatch;
          } 
        }
      }
    }
    return null;
  }
  
  public String getFullName()
  {
    if (getParentState() == null)
    {
      return name;
    }
    else
    {
      return getParentState().getStateMachine().getFullName() + StringFormatter.toPascalCase(name);
    }
  }
  
  public State addState(String aName, int index)
  {
    State newState = new State(aName,this);
    states.remove(newState);
    states.add(index,newState);
    return newState;
  }
}