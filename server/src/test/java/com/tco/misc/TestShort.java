package com.tco.misc;

import com.tco.misc.Short;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestShort{
    private Short newTrip;

    @Test
    @DisplayName("Short Constructor")
    public void testConstructor1() {
        newTrip = new Short();
        Double zero = 0.0;
        assert(zero.equals(newTrip.getRadius()));
        ArrayList<Map<String,String>> places = newTrip.getPlaces();
        assert(places.isEmpty());
    }

    @Test
    @DisplayName("Short Constructor")
    public void testConstructor2() {
        Map<String,String> place1 = new HashMap<String,String>(){{
            put("latitude", "39.7");
            put("longitude", "-105.0");
        }};
        Map<String,String> place2 = new HashMap<String,String>(){{
            put("latitude", "40.0");
            put("longitude", "-105.4");
        }};
        Map<String,String> place3 = new HashMap<String,String>(){{
            put("latitude", "40.6");
            put("longitude", "-105.1");
        }};
        ArrayList<Map<String,String>> places = new ArrayList<>();
        places.add(place1);
        places.add(place2);
        places.add(place3);
        newTrip = new Short(places,5.0);
        Double zero = 5.0;
        assert(zero.equals(newTrip.getRadius()));
        ArrayList<Map<String,String>> pl = newTrip.getPlaces();
        assert(!pl.isEmpty());
    }
}